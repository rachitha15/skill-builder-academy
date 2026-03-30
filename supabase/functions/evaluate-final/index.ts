import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = ['https://untutorial.in', 'https://www.untutorial.in', 'http://localhost:8080'];

const CLARA_NOTES = `clara's 1:1 with jake (product eng lead) 3/8

ran long, lots to cover. mktg wants the blog post about the new feature out by next weds but legal hasn't signed off on the claims yet. jake mentioned eng isn't confident the feature is stable — maybe push to the week after? I (clara) need to make the call.

design showed new onboarding mockups in the product review — everyone loved them but we need to figure out who builds it. maybe outsource? jake will get quotes from 3 agencies by fri.

one more thing: the customer advisory board meeting got moved to the 15th. not an action item just FYI.

oh and jake wants to take PTO week of the 20th — I need to check coverage for his team. will sort that out by monday.`;

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
    const { skillmd, userNotes } = await req.json();

    if (!skillmd || typeof skillmd !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing skillmd' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (skillmd.length > 15000) {
      return new Response(JSON.stringify({ error: 'Input too long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (userNotes && typeof userNotes === 'string' && userNotes.length > 5000) {
      return new Response(JSON.stringify({ error: 'Notes too long' }), {
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

    // Try-your-own mode: just produce output, no evaluation
    if (userNotes && typeof userNotes === 'string') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `Here is a Claude Skill:\n\n${skillmd}\n\nApply it to these meeting notes:\n\n${userNotes}\n\nProduce the output only. No evaluation needed. Respond in JSON: {"output": "..."}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
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

      try {
        const result = JSON.parse(jsonStr);
        return new Response(JSON.stringify({ output: result.output || jsonStr }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch {
        return new Response(JSON.stringify({ output: content }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Final test mode
    const systemPrompt = `You are Claude executing a complete Skill (frontmatter + instructions) against meeting notes. Follow the instructions to produce output, then evaluate quality. This is a final exam — be thorough but fair. Respond ONLY in valid JSON.`;

    const userPrompt = `Here is the complete SKILL.md:

${skillmd}

Apply this Skill to Clara's 1:1 notes:

${CLARA_NOTES}

Evaluate on these 6 criteria:
1. All genuine action items found (there are at least 4)
2. Clara's decision about blog post timeline is flagged as needing her action
3. Jake getting agency quotes has clear owner and deadline (Friday)
4. Advisory board date change correctly excluded as FYI
5. PTO coverage item assigned to Clara with Monday deadline
6. Output format is clean and consistent

Respond in this JSON format:
{
  "output": "The full output produced by following the Skill",
  "criteria": [
    {"name": "All action items found", "passed": true, "detail": "explanation"},
    {"name": "Blog post decision flagged", "passed": true, "detail": "explanation"},
    {"name": "Agency quotes has owner + deadline", "passed": true, "detail": "explanation"},
    {"name": "Advisory board FYI excluded", "passed": true, "detail": "explanation"},
    {"name": "PTO coverage assigned to Clara", "passed": true, "detail": "explanation"},
    {"name": "Clean output format", "passed": true, "detail": "explanation"}
  ],
  "score": 6,
  "passed": true,
  "feedback": "Brief final feedback"
}

IMPORTANT: Return ONLY valid JSON. The "passed" values should be actual booleans. Set "passed" (top-level) to true if score >= 4.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
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
    } catch {
      return new Response(JSON.stringify({ error: 'Failed to parse AI response', raw: content }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
