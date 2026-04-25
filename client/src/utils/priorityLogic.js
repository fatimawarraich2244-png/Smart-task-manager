/**
 * Priority Logic (Frontend)
 * Helper functions for priority labeling and styling
 */

export const getPriorityLabel = (priority) => {
  const labels = { high: 'High', medium: 'Medium', low: 'Low' };
  return labels[priority] || 'Medium';
};

export const getPriorityColor = (priority) => {
  const colors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };
  return colors[priority] || colors.medium;
};

export const getPriorityEmoji = (priority) => {
  const emojis = { high: '🔴', medium: '🟡', low: '🟢' };
  return emojis[priority] || '🟡';
};

export const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'completed': 'Completed',
  };
  return labels[status] || status;
};
