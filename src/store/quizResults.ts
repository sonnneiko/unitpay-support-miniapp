type Result = 'correct' | 'wrong';

const RESULTS_KEY = 'quiz_results';
const PROGRESS_KEY = 'quiz_progress';

type ResultsStore = Record<string, Result[]>;

interface Progress {
  currentIndex: number;
  results: Result[];
}

type ProgressStore = Record<string, Progress>;

const loadResults = (): ResultsStore => {
  try { return JSON.parse(localStorage.getItem(RESULTS_KEY) ?? '{}'); } catch { return {}; }
};

const loadProgress = (): ProgressStore => {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}'); } catch { return {}; }
};

export const saveTopicResults = (topicId: string, results: Result[]) => {
  const store = loadResults();
  store[topicId] = results;
  localStorage.setItem(RESULTS_KEY, JSON.stringify(store));
};

export const getTopicResults = (topicId: string): Result[] | null => {
  return loadResults()[topicId] ?? null;
};

export const saveTopicProgress = (topicId: string, currentIndex: number, results: Result[]) => {
  const store = loadProgress();
  store[topicId] = { currentIndex, results };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
};

export const getTopicProgress = (topicId: string): Progress | null => {
  return loadProgress()[topicId] ?? null;
};

export const clearTopicProgress = (topicId: string) => {
  const store = loadProgress();
  delete store[topicId];
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(store));
};
