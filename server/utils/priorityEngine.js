/**
 * Priority Engine (Backend)
 * Determines task priority based on due date proximity and other factors
 */

/**
 * Calculate priority label based on days until due date
 * @param {Date|null} dueDate - The task's due date
 * @returns {string} - 'high', 'medium', or 'low'
 */
const calculatePriority = (dueDate) => {
  if (!dueDate) return 'medium';

  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return 'high';
  if (diffDays <= 3) return 'medium';
  return 'low';
};

/**
 * Get priority weight for sorting (higher = more urgent)
 * @param {string} priority - 'low', 'medium', or 'high'
 * @returns {number}
 */
const getPriorityWeight = (priority) => {
  const weights = { high: 3, medium: 2, low: 1 };
  return weights[priority] || 0;
};

/**
 * Sort tasks by priority (highest first), then by due date
 * @param {Array} tasks - Array of task objects
 * @returns {Array} - Sorted tasks
 */
const sortByPriority = (tasks) => {
  return [...tasks].sort((a, b) => {
    const weightDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    if (weightDiff !== 0) return weightDiff;

    // If same priority, sort by due date (earliest first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });
};

module.exports = { calculatePriority, getPriorityWeight, sortByPriority };
