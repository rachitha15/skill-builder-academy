import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const MESSY_NOTES = `standup recap 3/5
- tom mentioned the homepage redesign is stuck waiting on copy from marketing. sarah said she'd have it by end of week but no promises
- we talked about the Q2 planning doc, jake is supposed to have a draft ready but didn't say when exactly
- oh also the onboarding flow has a bug where new users don't get the welcome email. seems important. nobody was assigned to fix it
- priya asked if we could move standup to 10am starting next week. everyone seemed fine with it
- IMPORTANT: client demo is Thursday. tom needs to prep the demo env by wednesday EOD`;

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

    const systemPrompt = `You are Claude following a user's Skill instructions to process meeting notes. First follow the instructions exactly to produce output. Then evaluate the quality. Respond in JSON only.`;

    const userPrompt = `Here are the instructions I need to follow:

${instructions}

Now apply these instructions to the following messy meeting notes:

${MESSY_NOTES}

Respond in this exact JSON format:
{
  "output": "The full output produced by following the instructions",
  "criteria": [
    {"name": "At least 4 action items", "passed": true, "detail": "why"},
    {"name": "Demo prep is high priority", "passed": true, "detail": "why"},
    {"name": "Unassigned owner handled", "passed": true, "detail": "why"},
    {"name": "Standup change excluded", "passed": true, "detail": "why"},
    {"name": "Vague deadlines handled", "passed": true, "detail": "why"},
    {"name": "Clean output format", "passed": true, "detail": "why"}
  ],
  "score": 6,
  "feedback": "One specific suggestion to improve the instructions"
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
        max_tokens: 2000,
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

    // Extract JSON from potential markdown code blocks
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let result;
    try {
      result = JSON.parse(jsonStr);
      if (!result.output || !result.criteria || typeof result.score !== 'number') {
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
      output: result.output,
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
