const Task = require('../models/Task');
const FocusSession = require('../models/FocusSession');
const User = require('../models/User');
const { calculateFocusXP, calculateLevel } = require('../utils/xpSystem');

/**
 * @desc    Get analytics/stats for the logged-in user
 * @route   GET /api/analytics
 * @access  Private
 */
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get task statistics
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'completed' });
    const pendingTasks = await Task.countDocuments({ userId, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ userId, status: 'in-progress' });

    // Task priority breakdown
    const highPriority = await Task.countDocuments({ userId, priority: 'high', status: { $ne: 'completed' } });
    const mediumPriority = await Task.countDocuments({ userId, priority: 'medium', status: { $ne: 'completed' } });
    const lowPriority = await Task.countDocuments({ userId, priority: 'low', status: { $ne: 'completed' } });

    // Focus session statistics
    const focusSessions = await FocusSession.find({ userId });
    const totalFocusTime = focusSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalSessions = focusSessions.length;

    // Weekly activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyTasks = await Task.countDocuments({
      userId,
      status: 'completed',
      updatedAt: { $gte: weekAgo },
    });

    const weeklySessions = await FocusSession.find({
      userId,
      date: { $gte: weekAgo },
    });

    const weeklyFocusTime = weeklySessions.reduce((sum, s) => sum + s.duration, 0);

    // Heatmap data (last 30 days of completed tasks)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);

    const completedTasksByDay = await Task.aggregate([
      {
        $match: {
          userId,
          status: 'completed',
          updatedAt: { $gte: monthAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // User XP info
    const user = await User.findById(userId);

    res.json({
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      priority: {
        high: highPriority,
        medium: mediumPriority,
        low: lowPriority,
      },
      focus: {
        totalTime: totalFocusTime,
        totalSessions,
        averageSession: totalSessions > 0 ? Math.round(totalFocusTime / totalSessions) : 0,
      },
      weekly: {
        tasksCompleted: weeklyTasks,
        focusTime: weeklyFocusTime,
        sessions: weeklySessions.length,
      },
      heatmap: completedTasksByDay,
      user: {
        xp: user.xp,
        level: calculateLevel(user.xp),
      },
    });
  } catch (error) {
    console.error('Analytics error:', error.message);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
};

/**
 * @desc    Create a focus session
 * @route   POST /api/analytics/focus
 * @access  Private
 */
const createFocusSession = async (req, res) => {
  try {
    const { duration, taskId, notes } = req.body;

    if (!duration || duration < 1) {
      return res.status(400).json({ message: 'Duration must be at least 1 minute' });
    }

    const session = await FocusSession.create({
      duration,
      userId: req.user._id,
      taskId: taskId || null,
      notes: notes || '',
    });

    // Award XP for focus session
    const xpEarned = calculateFocusXP(duration);
    const user = await User.findById(req.user._id);
    user.xp += xpEarned;
    user.level = calculateLevel(user.xp);
    await user.save();

    res.status(201).json({
      session,
      xpEarned,
      newXP: user.xp,
      newLevel: user.level,
    });
  } catch (error) {
    console.error('Create focus session error:', error.message);
    res.status(500).json({ message: 'Server error creating focus session' });
  }
};

/**
 * @desc    Get focus sessions for the logged-in user
 * @route   GET /api/analytics/focus
 * @access  Private
 */
const getFocusSessions = async (req, res) => {
  try {
    const sessions = await FocusSession.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(50)
      .populate('taskId', 'title');

    res.json(sessions);
  } catch (error) {
    console.error('Get focus sessions error:', error.message);
    res.status(500).json({ message: 'Server error fetching focus sessions' });
  }
};

module.exports = { getAnalytics, createFocusSession, getFocusSessions };
