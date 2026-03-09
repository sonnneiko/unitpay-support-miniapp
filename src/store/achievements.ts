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

export const getEarnedAchievements = (): string[] => load();
