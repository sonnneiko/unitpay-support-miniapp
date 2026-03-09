import { getTopicResults } from './quizResults';
import { achievements } from '@/data/achievements';

const KEY = 'achievements';

const load = (): string[] => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; }
};

export const unlockAchievement = (topicId: string): boolean => {
  const earned = load();
  if (earned.includes(topicId)) return false;
  earned.push(topicId);
  localStorage.setItem(KEY, JSON.stringify(earned));
  return true;
};

// Разблокирует ачивки за уже пройденные разделы без ошибок (на случай если ачивки появились позже)
export const backfillAchievements = (): void => {
  for (const achievement of achievements) {
    const results = getTopicResults(achievement.topicId);
    if (results && results.length > 0 && results.every(r => r === 'correct')) {
      unlockAchievement(achievement.topicId);
    }
  }
};

export const getEarnedAchievements = (): string[] => load();
