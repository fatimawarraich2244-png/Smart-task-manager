import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Trash2, Calendar, Award } from 'lucide-react';
import { getPriorityLabel, getStatusLabel } from '../utils/priorityLogic';
import confetti from 'canvas-confetti';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleStatusChange = (newStatus) => {
    // If completing the task, trigger a small confetti burst
    if (newStatus === 'completed' && task.status !== 'completed') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#6366f1']
      });
    }
    onUpdate(task._id, { status: newStatus }, task.status !== 'completed' && newStatus === 'completed');
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isCompleted = task.status === 'completed';
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
      whileHover={{ y: -4, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`glass-card relative overflow-hidden transition-all duration-300 ${isCompleted ? 'opacity-60 grayscale-[30%]' : 'hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] hover:border-primary/50'}`}
    >
      {/* Background glowing gradient when hovered */}
      <AnimatePresence>
        {!isCompleted && isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-start gap-4 flex-1">
          <motion.button
            whileTap={{ scale: 0.8, rotate: -15 }}
            onClick={() => handleStatusChange(isCompleted ? 'pending' : 'completed')}
            className={`mt-1 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 shadow-lg ${
              isCompleted 
                ? 'bg-success border-success text-white shadow-success/30' 
                : 'border-slate-400 text-transparent hover:border-success hover:shadow-success/20'
            }`}
          >
            <motion.div
              initial={false}
              animate={{ scale: isCompleted ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check size={16} strokeWidth={3} />
            </motion.div>
          </motion.button>
          
          <div className="flex-1">
            <motion.h4 
              animate={{ color: isCompleted ? '#94a3b8' : '#f1f5f9' }}
              className={`font-bold text-lg transition-colors ${isCompleted ? 'line-through decoration-slate-500/50' : ''}`}
            >
              {task.title}
            </motion.h4>
            <AnimatePresence>
              {task.description && isExpanded && (
                <motion.p 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="text-sm text-slate-400 mt-2 overflow-hidden border-l-2 border-primary/30 pl-3"
                >
                  {task.description}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: isExpanded ? 180 : 0 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"
        >
          <ChevronDown size={20} />
        </motion.button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex gap-2 items-center">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className={`badge badge-${task.priority}`}
          >
            {getPriorityLabel(task.priority)}
          </motion.span>
          <span className={`badge badge-${task.status.replace(' ', '-')}`}>
            {getStatusLabel(task.status)}
          </span>
          {isOverdue && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.5, 1, 0.5], scale: 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="badge badge-high"
            >
              Overdue
            </motion.span>
          )}
        </div>

        <div className="flex gap-3">
          {task.priority === 'high' && !isCompleted && (
            <div className="flex items-center gap-1 text-xs font-bold text-warning animate-pulse">
              <Award size={14} /> +XP Bonus
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              <Calendar size={14} className={isOverdue ? "text-danger" : ""} />
              <span className={isOverdue ? "text-danger" : ""}>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden relative z-10"
          >
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <select
                className="form-select w-auto py-1.5 text-sm cursor-pointer hover:border-primary/50"
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDelete(task._id)}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] px-3 py-1.5 rounded-lg transition-all"
              >
                <Trash2 size={16} /> Delete
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;
