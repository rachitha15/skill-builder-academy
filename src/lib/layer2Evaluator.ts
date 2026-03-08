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

const TEST_QUERIES: { text: string; expected: boolean }[] = [
  { text: "Here are my meeting notes from today, can you extract the action items?", expected: true },
  { text: "Pull out the to-dos from this standup recap", expected: true },
  { text: "What are the follow-ups from this meeting?", expected: true },
  { text: "I pasted my 1:1 notes, can you find the next steps?", expected: true },
  { text: "Extract action items and owners from these notes", expected: true },
  { text: "Help me schedule a meeting with the design team", expected: false },
  { text: "Write an agenda for tomorrow's sprint planning", expected: false },
];

// Positive trigger keywords — if description mentions these, it "triggers" for matching queries
const POSITIVE_KEYWORDS = [
  'action item', 'action-item', 'to-do', 'todo', 'follow-up', 'followup',
  'next step', 'meeting note', 'meeting transcript', 'standup', 'stand-up',
  '1:1', 'one-on-one', 'extract', 'owner', 'deadline', 'priority', 'task'
];

// Negative signal keywords — specificity that helps avoid false triggers
const SPECIFICITY_KEYWORDS = [
  'meeting note', 'meeting transcript', 'standup', 'recap', 'notes',
  'extract', 'action item', 'to-do', 'todo', 'follow-up'
];

function wouldTrigger(description: string, queryText: string): boolean {
  const descLower = description.toLowerCase();
  const queryLower = queryText.toLowerCase();

  // Count how many positive keywords the description contains
  const descKeywordHits = POSITIVE_KEYWORDS.filter(kw => descLower.includes(kw));

  // For positive queries (should trigger): check overlap between description keywords and query
  const queryKeywords = ['action item', 'to-do', 'todo', 'follow-up', 'followup', 'next step',
    'meeting note', 'standup', 'recap', '1:1', 'extract', 'owner', 'notes'];
  const queryHits = queryKeywords.filter(kw => queryLower.includes(kw));
  const descMatchesQuery = queryHits.some(kw => descLower.includes(kw));

  // For scheduling/agenda queries (should NOT trigger)
  const isSchedulingQuery = /schedul|agenda|plan(?:ning)?|book|set up a meeting/i.test(queryLower);

  if (isSchedulingQuery) {
    // Only false-triggers if description is too vague (few specificity keywords)
    const specificityScore = SPECIFICITY_KEYWORDS.filter(kw => descLower.includes(kw)).length;
    return specificityScore < 2; // Vague descriptions false-trigger
  }

  // For extraction queries: trigger if description has relevant keywords
  return descKeywordHits.length >= 2 && descMatchesQuery;
}

export async function evaluateDescription(description: string): Promise<Layer2Result> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const results: Layer2QueryResult[] = TEST_QUERIES.map((tq, i) => {
    const triggered = wouldTrigger(description, tq.text);
    return {
      query: i + 1,
      queryText: tq.text,
      triggered,
      expected: tq.expected,
      correct: triggered === tq.expected,
    };
  });

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

  return { results, score, maxScore: 7, feedback };
}
