import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

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
    const { query, sourceFilter, threshold, topic } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing query' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (query.length > 500) {
      return new Response(JSON.stringify({ error: 'Query too long', details: 'Query must be under 500 characters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const NEON_DATABASE_URL = Deno.env.get('NEON_DATABASE_URL');
    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

    if (!OPENAI_API_KEY || !NEON_DATABASE_URL || !ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: 'Required secrets not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 1: Generate embedding
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    });

    if (!embeddingResponse.ok) {
      const errText = await embeddingResponse.text();
      console.error('OpenAI embedding error:', errText);
      return new Response(JSON.stringify({ error: 'Failed to generate embedding', details: errText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const embeddingData = await embeddingResponse.json();
    const embedding: number[] = embeddingData.data?.[0]?.embedding;

    if (!embedding) {
      return new Response(JSON.stringify({ error: 'No embedding returned from OpenAI' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 2: Vector search in Neon
    const client = new Client(NEON_DATABASE_URL);
    await client.connect();

    // content_type filter (newsletter / podcast / both)
    let contentTypeFilter = '';
    const src = sourceFilter || 'both';
    if (src === 'newsletter') {
      contentTypeFilter = "AND content_type = 'newsletter'";
    } else if (src === 'podcast') {
      contentTypeFilter = "AND content_type = 'podcast'";
    }

    const similarityThreshold = typeof threshold === 'number' ? threshold : 0.45;
    const embeddingStr = `[${embedding.join(',')}]`;

    // Use subquery so $1 (vector) is referenced only once
    const result = await client.queryObject(`
      SELECT text, source_title, chunk_type, content_type, similarity
      FROM (
        SELECT text, source_title, chunk_type, content_type,
          1 - (embedding <=> $1::vector) AS similarity
        FROM chunks
      ) ranked
      WHERE similarity >= $2
      ${contentTypeFilter}
      ORDER BY similarity DESC
      LIMIT 8
    `, [embeddingStr, similarityThreshold]);

    await client.end();

    const rows = result.rows as Array<{ text: string; source_title: string; chunk_type: string; content_type: string; similarity: number }>;

    if (rows.length === 0) {
      return new Response(JSON.stringify({
        results: [],
        synthesis: 'No results found at this threshold. Try a lower threshold or different query.',
        sources_used: [],
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Step 3: Synthesize with Claude
    const chunksText = rows.map((r, i) =>
      `[${i + 1}] Source: ${r.source_title}\n${r.text}`
    ).join('\n\n---\n\n');

    const synthesisPrompt = `Create a playbook section from these expert sources about "${topic || query}".

Requirements:
- Cite experts by name (e.g., "According to Elena Verna...")
- 200-300 words
- Structured with clear insights, not a bullet dump
- Surface any disagreements or contrasting views
- Make it practically useful for a PM

Sources:
${chunksText}

Produce the playbook section now.`;

    const synthesisResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{ role: 'user', content: synthesisPrompt }],
      }),
    });

    if (!synthesisResponse.ok) {
      const errText = await synthesisResponse.text();
      console.error('Anthropic synthesis error:', errText);
      return new Response(JSON.stringify({ error: 'AI synthesis failed', details: errText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const synthesisData = await synthesisResponse.json();
    const synthesis = synthesisData.content?.[0]?.text?.trim() || '';

    const sourcesUsed = [...new Set(rows.map(r => r.source_title))];

    return new Response(JSON.stringify({
      results: rows.map(r => ({
        text: r.text,
        source: r.source_title,
        chunk_type: r.chunk_type,
        content_type: r.content_type,
        similarity: r.similarity,
      })),
      synthesis,
      sources_used: sourcesUsed,
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
