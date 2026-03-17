type Result = 'correct' | 'wrong';

const RESULTS_KEY = 'quiz_results';
const PROGRESS_KEY = 'quiz_progress';

type ResultsStore = Record<string, Result[]>;

interface Progress {
  currentIndex: number;
  results: Result[];
  questionOrder?: number[];
  optionOrders?: number[][];
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

export const saveTopicProgress = (topicId: string, currentIndex: number, results: Result[], questionOrder?: number[], optionOrders?: number[][]) => {
  const store = loadProgress();
  store[topicId] = { currentIndex, results, questionOrder, optionOrders };
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

export const clearTopicResults = (topicId: string) => {
  const store = loadResults();
  delete store[topicId];
  localStorage.setItem(RESULTS_KEY, JSON.stringify(store));
};

// Очищает испорченный прогресс: если savedProgress.results.length >= savedResults.length,
// значит это артефакт старого бага (просмотр уже завершённого теста).
export const cleanupCorruptedProgress = (topicQuestionCounts: Record<string, number>) => {
  const progressStore = loadProgress();
  const resultsStore = loadResults();
  let changed = false;
  for (const topicId of Object.keys(progressStore)) {
    const progress = progressStore[topicId];
    const questionCount = topicQuestionCounts[topicId];
    const progressResultsLen = (progress.results ?? []).length;
    if (questionCount !== undefined && progressResultsLen >= questionCount) {
      delete progressStore[topicId];
      changed = true;
    } else if (resultsStore[topicId] && progressResultsLen === 0 && (progress.currentIndex ?? 0) === 0) {
      delete progressStore[topicId];
      changed = true;
    }
  }
  if (changed) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressStore));
  }
};
