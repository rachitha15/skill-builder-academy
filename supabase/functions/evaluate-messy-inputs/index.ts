import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const INPUT_1 = `talked to marketing today. they want to redo the landing page AND the pricing page but cant agree on timeline. lisa thinks 2 weeks, dev says 4. probably should figure that out. oh and compliance needs the privacy policy updated before we launch anything public-facing. thats probably most urgent actually. also someone remind me to cancel the old analytics subscription its costing us like $500/mo for nothing.`;

const INPUT_2 = `eng sync re: API perf issues
- J will own the db query optimization, ETA tbd
- M to check w/ infra on caching layer, prob by EOW
- need to loop in S from security for the auth token thing asap
- also FYI the staging env is down again, not blocking but annoying
- AI: revisit rate limiting strategy next sprint`;

const INPUT_3 = `Product review meeting 3/7:
- Homepage hero section: T will take the first pass at copy. Actually wait, S said she already started on this. Let T and S figure out who's owning it.
- Mobile nav: Everyone agrees it's broken. Priority is high but we don't have bandwidth until next sprint. Mark it as P1 but no action until sprint 14.
- Analytics dashboard: "Would be nice to have real-time data" per J. Not a priority. Or actually, if the client demo goes well Thursday it might become urgent. Let's revisit after the demo.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { instructions } = await req.json();

    if (!instructions || typeof instructions !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing instructions' }), {
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

    const systemPrompt = `You are Claude testing a Skill's instructions against 3 messy meeting note inputs. For each input, follow the instructions exactly to produce output, then evaluate quality on 4 criteria. Respond ONLY in valid JSON.`;

    const userPrompt = `Here are the Skill instructions to follow:

${instructions}

Test against these 3 inputs from Clara:

--- INPUT 1: The Run-On Ramble (Leadership Sync) ---
${INPUT_1}

--- INPUT 2: The Abbreviation Fest (Engineering Standup) ---
${INPUT_2}

--- INPUT 3: The Contradiction (Product Review) ---
${INPUT_3}

For EACH input, follow the instructions and produce the output. Then evaluate on these 4 criteria:
1. All genuine action items found (not missed)
2. Non-actions correctly excluded (FYIs, status updates, decisions that don't require action)
3. Ambiguities handled gracefully (unclear owners, vague deadlines, contradictions addressed — not silently ignored)
4. Output format is consistent across all 3 inputs

Respond in this exact JSON format:
{
  "input_1": {
    "title": "The Run-On Ramble",
    "output": "The full output produced for this input",
    "criteria": [
      {"name": "Action items found", "passed": true, "detail": "explanation"},
      {"name": "Non-actions excluded", "passed": true, "detail": "explanation"},
      {"name": "Ambiguities handled", "passed": true, "detail": "explanation"},
      {"name": "Format consistent", "passed": true, "detail": "explanation"}
    ],
    "score": 4
  },
  "input_2": {
    "title": "The Abbreviation Fest",
    "output": "The full output produced for this input",
    "criteria": [
      {"name": "Action items found", "passed": true, "detail": "explanation"},
      {"name": "Non-actions excluded", "passed": true, "detail": "explanation"},
      {"name": "Ambiguities handled", "passed": true, "detail": "explanation"},
      {"name": "Format consistent", "passed": true, "detail": "explanation"}
    ],
    "score": 4
  },
  "input_3": {
    "title": "The Contradiction",
    "output": "The full output produced for this input",
    "criteria": [
      {"name": "Action items found", "passed": true, "detail": "explanation"},
      {"name": "Non-actions excluded", "passed": true, "detail": "explanation"},
      {"name": "Ambiguities handled", "passed": true, "detail": "explanation"},
      {"name": "Format consistent", "passed": true, "detail": "explanation"}
    ],
    "score": 4
  },
  "total_score": 12,
  "feedback": "One specific, actionable suggestion for the next iteration"
}

IMPORTANT: Return ONLY valid JSON. The "passed" values should be actual booleans based on your evaluation. The "detail" should explain your reasoning briefly.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
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
    const content = data.content?.[0]?.text?.trim() || '{}';

    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let result;
    try {
      result = JSON.parse(jsonStr);
      if (!result.input_1 || !result.input_2 || !result.input_3 || typeof result.total_score !== 'number') {
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
      input_1: result.input_1,
      input_2: result.input_2,
      input_3: result.input_3,
      total_score: result.total_score,
      max_score: 12,
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
