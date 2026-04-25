import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { xpProgress } from '../utils/xpCalculator';
import ProgressBar from '../components/ProgressBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ListTodo, Loader, Trophy, Star, Sparkles, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player } from '@lottiefiles/react-lottie-player';

// Motivational quotes array
const QUOTES = [
  "Level up your life, one task at a time.",
  "You're an unstoppable force of productivity!",
  "XP awaits! Crush those goals today.",
  "Focus, execute, dominate.",
  "Every checked box is a step closer to mastery.",
  "Greatness is built on daily habits."
];

const Dashboard = () => {
  const { user, token, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [quote, setQuote] = useState(QUOTES[0]);
  const [xpPopup, setXpPopup] = useState(null); // { amount: number, id: string }

  useEffect(() => {
    fetchTasks();
    // Randomize quote on load
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const filters = filter !== 'all' ? { status: filter } : {};
      const data = await taskService.getTasks(token, { ...filters, sort: 'priority' });
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(token, taskData);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const triggerLevelUpConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#8b5cf6', '#f59e0b']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#8b5cf6', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleUpdateTask = async (id, updateData, isNewlyCompleted = false) => {
    try {
      const updatedTask = await taskService.updateTask(token, id, updateData);
      
      if (updatedTask.newXP) {
        const xpEarned = updatedTask.newXP - user.xp;
        const levelUp = updatedTask.newLevel > user.level;

        updateUser({ xp: updatedTask.newXP, level: updatedTask.newLevel });

        if (isNewlyCompleted) {
          // Show floating XP animation
          setXpPopup({ amount: xpEarned, id: Date.now().toString() });
          setTimeout(() => setXpPopup(null), 2000);

          if (levelUp) {
            triggerLevelUpConfetti();
          }
        }
      }
      
      setTasks(tasks.map(t => t._id === id ? { ...t, ...updateData } : t));
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(token, id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const activeCount = tasks.filter(t => t.status !== 'completed').length;

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Floating XP Animation Overlay */}
      <AnimatePresence>
        {xpPopup && (
          <motion.div
            key={xpPopup.id}
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: -100, scale: 1.5 }}
            exit={{ opacity: 0, y: -150, scale: 2 }}
            transition={{ duration: 1.5, type: "spring" }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex items-center gap-2 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-warning to-yellow-300 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]"
          >
            <Sparkles size={40} className="text-warning" />
            +{xpPopup.amount} XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/10 backdrop-blur-md border border-primary/20 rounded-2xl p-4 mb-8 flex items-center gap-4 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
      >
        <div className="bg-primary/20 p-2 rounded-xl text-primary animate-pulse">
          <Zap size={24} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-primary tracking-wider uppercase">Daily Motivation</h2>
          <p className="font-bold italic bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">"{quote}"</p>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-gradient mb-2 tracking-tight">Ready to conquer, {user?.name}?</h1>
          <p className="text-slate-400 text-lg">
            You have <span className="text-primary font-bold text-xl px-1">{activeCount}</span> active quests today.
          </p>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-card w-full md:w-72 p-5 border-primary/30 relative overflow-hidden group cursor-default"
        >
          {/* Animated background glow on card */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex justify-between items-center mb-3 font-bold relative z-10">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-warning" />
              <span className="text-slate-200 text-lg">Level {user?.level || 1}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
              <Star size={14} className="text-yellow-400" />
              <span className="text-primary font-bold">{user?.xp || 0} XP</span>
            </div>
          </div>
          <ProgressBar progress={xpProgress(user?.xp || 0)} color="bg-gradient-to-r from-primary via-secondary to-purple-500" />
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-surface/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="flex w-full sm:w-auto">
          {['all', 'pending', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold rounded-xl capitalize transition-all duration-300 relative ${
                filter === f ? 'text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {filter === f && (
                <motion.div 
                  layoutId="filter-bg"
                  className="absolute inset-0 bg-primary rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          ))}
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn w-full sm:w-auto px-6 py-2.5 font-bold ${showForm ? 'bg-white/10 text-slate-200 hover:bg-white/20' : 'btn-primary'}`} 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : <><Plus size={20} strokeWidth={3} /> Add New Quest</>}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowForm(false)} />
        )}
      </AnimatePresence>

      <div className="mt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="animate-spin w-12 h-12 text-primary mb-4" />
            <p className="text-slate-400 font-medium animate-pulse">Loading your quests...</p>
          </div>
        ) : tasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card flex flex-col items-center justify-center py-20 text-center border-dashed border-2 border-white/10"
          >
            <div className="w-48 h-48 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <Player
                autoplay
                loop
                src="https://assets2.lottiefiles.com/packages/lf20_Q895iE.json"
              />
            </div>
            <h3 className="text-2xl font-black mb-3 text-slate-100">No active quests</h3>
            <p className="text-slate-400 max-w-md text-lg">
              Your quest log is empty. Create a new task and start earning XP!
            </p>
            {!showForm && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="mt-8 btn btn-primary px-8 py-3"
              >
                Accept New Quest
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4 pb-20"
          >
            <AnimatePresence mode="popLayout">
              {tasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onUpdate={handleUpdateTask} 
                  onDelete={handleDeleteTask} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
