/**
 * XP (Experience Points) System
 * Gamification logic for task completion rewards
 */

// XP rewards per action
const XP_REWARDS = {
  TASK_COMPLETE: 25,
  TASK_COMPLETE_HIGH: 50,    // High priority task bonus
  TASK_COMPLETE_ON_TIME: 10, // Bonus for completing before due date
  FOCUS_SESSION: 15,         // Per focus session
  STREAK_BONUS: 20,          // Daily streak bonus
};

/**
 * Calculate XP earned for completing a task
 * @param {Object} task - The completed task
 * @returns {number} - XP earned
 */
const calculateTaskXP = (task) => {
  let xp = XP_REWARDS.TASK_COMPLETE;

  // Bonus for high priority tasks
  if (task.priority === 'high') {
    xp += XP_REWARDS.TASK_COMPLETE_HIGH;
  } else if (task.priority === 'medium') {
    xp += 15;
  }

  // Bonus for completing before due date
  if (task.dueDate && new Date() < new Date(task.dueDate)) {
    xp += XP_REWARDS.TASK_COMPLETE_ON_TIME;
  }

  return xp;
};

/**
 * Calculate XP for a focus session
 * @param {number} durationMinutes - Session duration in minutes
 * @returns {number} - XP earned
 */
const calculateFocusXP = (durationMinutes) => {
  // Base XP + bonus for longer sessions
  let xp = XP_REWARDS.FOCUS_SESSION;
  if (durationMinutes >= 25) xp += 10;
  if (durationMinutes >= 50) xp += 20;
  return xp;
};

/**
 * Calculate level from total XP
 * Each level requires progressively more XP
 * @param {number} totalXP - User's total XP
 * @returns {number} - Current level
 */
const calculateLevel = (totalXP) => {
  // Level formula: level = floor(sqrt(totalXP / 100)) + 1
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

/**
 * Calculate XP needed for next level
 * @param {number} currentLevel - Current level
 * @returns {number} - Total XP needed for next level
 */
const xpForNextLevel = (currentLevel) => {
  return Math.pow(currentLevel, 2) * 100;
};

module.exports = {
  XP_REWARDS,
  calculateTaskXP,
  calculateFocusXP,
  calculateLevel,
  xpForNextLevel,
};
