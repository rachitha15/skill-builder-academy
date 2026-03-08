import { supabase } from "@/integrations/supabase/client";

export interface Layer2QueryResult {
  query: number;
  queryText: string;
  triggered: boolean;
  expected: boolean;
  correct: boolean;
}

export interface Layer2Result {
  results: Layer2QueryResult[];
  score: number;
  maxScore: number;
  feedback: string;
}

export async function evaluateDescription(description: string): Promise<Layer2Result> {
  const { data, error } = await supabase.functions.invoke('evaluate-description', {
    body: { description },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error('Failed to evaluate description. Please try again.');
  }

  if (data.error) {
    console.error('Evaluation error:', data.error);
    throw new Error(data.error);
  }

  return data as Layer2Result;
}
