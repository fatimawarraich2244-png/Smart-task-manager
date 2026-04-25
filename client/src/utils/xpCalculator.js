/**
 * XP Calculator (Frontend)
 * Mirrors backend XP logic for UI display
 */

export const calculateLevel = (totalXP) => {
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

export const xpForNextLevel = (currentLevel) => {
  return Math.pow(currentLevel, 2) * 100;
};

export const xpProgress = (totalXP) => {
  const level = calculateLevel(totalXP);
  const currentLevelXP = Math.pow(level - 1, 2) * 100;
  const nextLevelXP = xpForNextLevel(level);
  const progress = ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export const getLevelTitle = (level) => {
  if (level >= 20) return 'Grandmaster';
  if (level >= 15) return 'Master';
  if (level >= 10) return 'Expert';
  if (level >= 7) return 'Advanced';
  if (level >= 5) return 'Intermediate';
  if (level >= 3) return 'Apprentice';
  return 'Beginner';
};
