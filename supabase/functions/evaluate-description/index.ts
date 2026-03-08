import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TEST_QUERIES = [
  { text: "Here are my standup notes from today, can you pull out the action items?", expected: true },
  { text: "What are the follow-ups from my 1:1 with Jake?", expected: true },
  { text: "Extract the to-dos from this sprint retro", expected: true },
  { text: "I pasted the leadership sync notes, what did we commit to doing?", expected: true },
  { text: "Go through these meeting notes and find everything that needs an owner", expected: true },
  { text: "Draft an email to the marketing team about the product launch", expected: false },
  { text: "Write a project brief for the new onboarding flow", expected: false },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();

    if (!description || typeof description !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing description' }), {
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

    const systemPrompt = `You are a trigger-matching evaluator for Claude Skills. A Skill's "description" field determines when the Skill activates in response to a user query.

Given the Skill description below, evaluate whether each test query would trigger this Skill. A query should trigger if it closely matches what the description says the Skill handles. A query should NOT trigger if it's about a different task (like scheduling, agenda writing, etc.) even if it mentions meetings.

Respond with a JSON array of 7 booleans, one per query. true = would trigger, false = would not trigger.

Example response: [true, true, true, true, true, false, false]

IMPORTANT: Return ONLY the JSON array, no other text.`;

    const userPrompt = `Skill description:
"""
${description}
"""

Test queries:
${TEST_QUERIES.map((q, i) => `${i + 1}. "${q.text}"`).join('\n')}

Would each query trigger this Skill? Return a JSON array of 7 booleans.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return new Response(JSON.stringify({ error: 'Anthropic API error', details: errText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text?.trim() || '[]';

    let triggers: boolean[];
    try {
      triggers = JSON.parse(content);
      if (!Array.isArray(triggers) || triggers.length !== 7) {
        throw new Error('Invalid response format');
      }
    } catch {
      console.error('Failed to parse Anthropic response:', content);
      return new Response(JSON.stringify({ error: 'Failed to parse AI response', raw: content }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = TEST_QUERIES.map((tq, i) => ({
      query: i + 1,
      queryText: tq.text,
      triggered: triggers[i],
      expected: tq.expected,
      correct: triggers[i] === tq.expected,
    }));

    const score = results.filter(r => r.correct).length;

    let feedback: string;
    if (score === 7) {
      feedback = "Perfect trigger accuracy! Your description is specific enough to activate on relevant queries and ignore unrelated ones.";
    } else if (score >= 5) {
      feedback = "Good accuracy. Your description captures most triggers correctly. Check the failed cases — you may need to be more specific about what your Skill processes vs. general meeting tasks.";
    } else if (score >= 4) {
      feedback = "Passing, but barely. Your description is either too vague (triggering on scheduling queries) or too narrow (missing some extraction queries). Add more specific keywords about inputs and outputs.";
    } else {
      feedback = "Your description needs work. Make sure it mentions specific inputs (meeting notes, standup recaps) and outputs (action items, to-dos, follow-ups). Use 'Use when' to clarify trigger criteria.";
    }

    return new Response(JSON.stringify({ results, score, maxScore: 7, feedback }), {
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
