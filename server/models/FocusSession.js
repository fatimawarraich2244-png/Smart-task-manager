const mongoose = require('mongoose');

/**
 * FocusSession Schema
 * Tracks productivity sessions (Pomodoro-style focus blocks)
 */
const focusSessionSchema = new mongoose.Schema(
  {
    duration: {
      type: Number, // Duration in minutes
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Notes cannot exceed 200 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for analytics queries
focusSessionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('FocusSession', focusSessionSchema);
