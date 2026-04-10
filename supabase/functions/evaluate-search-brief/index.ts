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
    const { brief, topic } = await req.json();

    if (!brief || typeof brief !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing brief' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (brief.length > 5000) {
      return new Response(JSON.stringify({ error: 'Input too long', details: 'Brief must be under 5000 characters' }), {
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

    const userPrompt = `You are evaluating a PM's playbook outline for building a PM playbook from Lenny Rachitsky's archive (349 newsletters + 289 podcasts).

Topic: ${topic || 'unknown'}

The PM wrote this playbook outline describing 3 sections — what each section covers, what type of content it needs, and what source (newsletters/podcasts/both) is best for each:

---
${brief}
---

Evaluate on these 6 criteria. Return ONLY valid JSON:

{
  "criteria": [
    {"name": "Three sections cover distinct aspects of the topic (not three versions of the same thing)", "passed": true, "detail": "brief explanation"},
    {"name": "Content types match what each section needs (benchmarks/frameworks → newsletters, stories/examples → podcasts)", "passed": true, "detail": "brief explanation"},
    {"name": "Source choices are reasonable and justified", "passed": true, "detail": "brief explanation"},
    {"name": "Sections would combine into a useful playbook (not three unrelated topics)", "passed": true, "detail": "brief explanation"},
    {"name": "Outline is specific to the chosen topic (not generic advice that fits any topic)", "passed": true, "detail": "brief explanation"},
    {"name": "A reader could understand what each section will contain", "passed": true, "detail": "brief explanation"}
  ],
  "score": 4,
  "maxScore": 6,
  "feedback": "One specific, actionable suggestion to improve the outline"
}

IMPORTANT: Return ONLY valid JSON. Set "passed" to actual booleans based on your evaluation.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: userPrompt }],
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
    const content = data.content?.[0]?.text?.trim() || '{}';

    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) jsonStr = jsonMatch[1].trim();

    let result;
    try {
      result = JSON.parse(jsonStr);
      if (!result.criteria || typeof result.score !== 'number') {
        throw new Error('Invalid response structure');
      }
    } catch {
      console.error('Failed to parse AI response:', content);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response', raw: content }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      criteria: result.criteria,
      score: result.score,
      maxScore: 6,
      feedback: result.feedback,
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
