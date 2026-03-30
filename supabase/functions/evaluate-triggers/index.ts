import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = ['https://untutorial.in', 'https://www.untutorial.in', 'http://localhost:8080'];

serve(async (req) => {
  const origin = req.headers.get('origin') || '';
  const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : 'https://untutorial.in',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, shouldTrigger, shouldNotTrigger } = await req.json();

    if (!description || typeof description !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing Skill description from Module 3. Complete Module 3 first.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(shouldTrigger) || !Array.isArray(shouldNotTrigger) || shouldTrigger.length !== 5 || shouldNotTrigger.length !== 5) {
      return new Response(JSON.stringify({ error: 'Must provide exactly 5 positive and 5 negative queries' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (description.length > 3000) {
      return new Response(JSON.stringify({ error: 'Input too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allQueries = [...shouldTrigger, ...shouldNotTrigger];
    if (allQueries.some(q => typeof q !== 'string' || q.length > 500)) {
      return new Response(JSON.stringify({ error: 'Query too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You evaluate whether a Claude Skill would trigger for given queries based on its description. For each query, determine if the description would cause you to load and use this Skill. Also evaluate the quality of the test suite itself. Respond ONLY in valid JSON.`;

    const userPrompt = `Here is the Skill description:

${description}

For each query below, answer: would you load this Skill? true or false.

Should trigger:
1. ${shouldTrigger[0]}
2. ${shouldTrigger[1]}
3. ${shouldTrigger[2]}
4. ${shouldTrigger[3]}
5. ${shouldTrigger[4]}

Should NOT trigger:
6. ${shouldNotTrigger[0]}
7. ${shouldNotTrigger[1]}
8. ${shouldNotTrigger[2]}
9. ${shouldNotTrigger[3]}
10. ${shouldNotTrigger[4]}

For queries 1-5, the expected answer is true (should trigger).
For queries 6-10, the expected answer is false (should not trigger).

Also evaluate the test suite quality:
- diverse_positive: Are the 5 positive triggers diverse in phrasing (not just minor variations of each other)?
- tricky_negatives: Are the negative triggers genuinely tricky (related to meetings/work but NOT about extracting action items)?
- missing_scenarios: List 1-2 important test scenarios the user didn't cover.

Respond in this exact JSON format:
{
  "results": [
    {"query_number": 1, "query_text": "...", "triggered": true, "expected": true, "correct": true},
    {"query_number": 2, "query_text": "...", "triggered": true, "expected": true, "correct": true}
  ],
  "trigger_score": 8,
  "suite_quality": {
    "diverse_positive": true,
    "tricky_negatives": true,
    "missing_scenarios": ["scenario 1", "scenario 2"]
  },
  "feedback": "One specific suggestion to improve the test suite or the description"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return new Response(JSON.stringify({ error: 'AI evaluation failed', details: errText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text?.trim() || '';

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response:', content);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response', raw: content }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build full results array with all 10 queries
    const allQueries = [...shouldTrigger, ...shouldNotTrigger];
    const results = allQueries.map((q, i) => {
      const expected = i < 5;
      const aiResult = parsed.results?.find((r: any) => r.query_number === i + 1);
      const triggered = aiResult?.triggered ?? expected;
      return {
        query_number: i + 1,
        query_text: q,
        triggered,
        expected,
        correct: triggered === expected,
      };
    });

    const triggerScore = results.filter((r: any) => r.correct).length;

    return new Response(JSON.stringify({
      results,
      trigger_score: triggerScore,
      suite_quality: parsed.suite_quality || { diverse_positive: true, tricky_negatives: true, missing_scenarios: [] },
      feedback: parsed.feedback || 'No additional feedback.',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
