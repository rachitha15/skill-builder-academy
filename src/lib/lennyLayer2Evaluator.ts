import { supabase } from "@/integrations/supabase/client";

export async function evaluateSearchBrief(brief: string, topic: string): Promise<any> {
  const { data, error } = await supabase.functions.invoke('evaluate-search-brief', {
    body: { brief, topic },
  });

  if (error) {
    console.error('Edge function error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(msg || 'Failed to evaluate search brief. Please try again.');
  }

  if (data?.error) {
    console.error('Evaluation error:', data.error);
    throw new Error(data.details ? `${data.error}: ${data.details}` : data.error);
  }

  if (!data?.criteria || !Array.isArray(data.criteria)) {
    throw new Error('Unexpected response format from evaluation service.');
  }

  return data;
}

export async function evaluateSynthesisPrompt(prompt: string, topic: string): Promise<any> {
  const { data, error } = await supabase.functions.invoke('evaluate-synthesis-prompt', {
    body: { prompt, topic },
  });

  if (error) {
    console.error('Edge function error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(msg || 'Failed to evaluate synthesis prompt. Please try again.');
  }

  if (data?.error) {
    console.error('Evaluation error:', data.error);
    throw new Error(data.details ? `${data.error}: ${data.details}` : data.error);
  }

  if (!data?.criteria || !Array.isArray(data.criteria)) {
    throw new Error('Unexpected response format from evaluation service.');
  }

  return data;
}

// Used by Mission 5 — passes live-fetched chunks instead of hardcoded Mission 4 chunks
export async function synthesizeSection(prompt: string, topic: string, rawChunks: string): Promise<any> {
  const { data, error } = await supabase.functions.invoke('evaluate-synthesis-prompt', {
    body: { prompt, topic, rawChunks },
  });

  if (error) {
    console.error('Edge function error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(msg || 'Synthesis failed. Please try again.');
  }

  if (data?.error) {
    console.error('Synthesis error:', data.error);
    throw new Error(data.details ? `${data.error}: ${data.details}` : data.error);
  }

  if (!data?.synthesis || !data?.criteria) {
    throw new Error('Unexpected response format from synthesis service.');
  }

  return data;
}

export async function lennySearch(query: string, sourceFilter: string, threshold: number, topic: string): Promise<any> {
  const { data, error } = await supabase.functions.invoke('lenny-search', {
    body: { query, sourceFilter, threshold, topic },
  });

  if (error) {
    console.error('Edge function error:', error);
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(msg || 'Search failed. Please try again.');
  }

  if (data?.error) {
    console.error('Search error:', data.error);
    throw new Error(data.details ? `${data.error}: ${data.details}` : data.error);
  }

  if (!data?.results) {
    throw new Error('Unexpected response format from search service.');
  }

  return data;
}
