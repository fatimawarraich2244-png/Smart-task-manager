import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Brain, Coffee, Target, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Player } from '@lottiefiles/react-lottie-player';

const FOCUS_QUOTES = [
  "Deep work is your superpower.",
  "Distractions destroy, focus creates.",
  "Stay in the zone. You're doing great.",
  "Every minute of focus is a brick in your empire.",
  "Silence the noise. Amplify your mind."
];

const FocusMode = () => {
  const { token, updateUser } = useAuth();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus');
  const [notes, setNotes] = useState('');
  const [quote, setQuote] = useState(FOCUS_QUOTES[0]);

  const MODES = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    // Change quote randomly on mount
    setQuote(FOCUS_QUOTES[Math.floor(Math.random() * FOCUS_QUOTES.length)]);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode]);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode]);
  };

  const handleSessionComplete = async () => {
    setIsActive(false);
    
    // Fire confetti for any completed session!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (mode === 'focus') {
      try {
        const duration = 25;
        const res = await analyticsService.createFocusSession(token, { duration, notes });
        
        if (res.newXP) {
          updateUser({ xp: res.newXP, level: res.newLevel });
          // Could add a toast here instead of alert in the future
        }
      } catch (error) {
        console.error('Failed to log session', error);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((MODES[mode] - timeLeft) / MODES[mode]) * 100;
  const isFocus = mode === 'focus';

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto pt-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-black text-gradient mb-0 tracking-tight">Deep Focus</h1>
        <div className="w-48 h-48 mx-auto opacity-90 drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]">
          <Player
            autoplay
            loop
            src="https://assets9.lottiefiles.com/packages/lf20_x62chJ.json"
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-lg">
          <Target size={18} className="text-primary" />
          <p className="font-bold italic bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">"{quote}"</p>
        </div>
      </motion.div>

      <motion.div 
        layout
        className={`glass-card w-full flex flex-col items-center p-12 relative overflow-hidden transition-all duration-700 ${
          isActive && isFocus ? 'border-primary/50 shadow-[0_0_50px_rgba(99,102,241,0.15)] scale-[1.02]' : 'border-white/10'
        }`}
      >
        {/* Pulsing background when active */}
        <AnimatePresence>
          {isActive && isFocus && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="flex bg-surface/40 backdrop-blur-md p-1.5 rounded-2xl mb-12 border border-white/5 shadow-inner">
          {[
            { id: 'focus', label: 'Pomodoro', icon: <Brain size={18} /> },
            { id: 'shortBreak', label: 'Short Break', icon: <Coffee size={18} /> },
            { id: 'longBreak', label: 'Long Break', icon: <Coffee size={18} /> }
          ].map((m) => (
            <button 
              key={m.id}
              onClick={() => changeMode(m.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all relative ${
                mode === m.id ? 'text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode === m.id && (
                <motion.div 
                  layoutId="mode-bg-focus"
                  className={`absolute inset-0 rounded-xl ${m.id === 'focus' ? 'bg-primary' : 'bg-emerald-500'}`}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">{m.icon}{m.label}</span>
            </button>
          ))}
        </div>

        <div className="relative w-72 h-72 flex items-center justify-center mb-14">
          <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_25px_rgba(99,102,241,0.4)]">
            <circle cx="144" cy="144" r="136" className="fill-surface/50 stroke-white/5 stroke-[12]" />
            <motion.circle 
              cx="144" cy="144" r="136" 
              className={`fill-transparent stroke-[12] stroke-linecap-round ${isFocus ? 'stroke-primary' : 'stroke-emerald-500'}`}
              initial={{ strokeDashoffset: 855 }}
              animate={{ strokeDashoffset: 855 - (855 * progress) / 100 }}
              transition={{ ease: "linear", duration: 1 }}
              style={{ strokeDasharray: 855 }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <div className={`text-7xl font-black tabular-nums tracking-tighter ${isActive ? 'text-white' : 'text-slate-300'}`}>
              {formatTime(timeLeft)}
            </div>
            {isFocus && isActive && (
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-primary font-bold text-sm tracking-widest uppercase mt-2 flex items-center gap-1"
              >
                <div className="w-2 h-2 rounded-full bg-primary" /> Focusing
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`btn flex-1 py-4 text-xl font-black tracking-wide ${
              isActive 
                ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20' 
                : (isFocus ? 'btn-primary shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]')
            }`} 
            onClick={toggleTimer}
          >
            {isActive ? <><Pause size={24} /> Pause</> : <><Play size={24} className="fill-current" /> Start</>}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary py-4 px-6 border-white/10 hover:border-white/20 hover:bg-white/10" 
            onClick={resetTimer} 
            title="Reset"
          >
            <RotateCcw size={24} />
          </motion.button>
        </div>

        <AnimatePresence>
          {mode === 'focus' && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="w-full max-w-sm"
            >
              <div className="bg-surface/40 backdrop-blur-sm p-1 rounded-xl border border-white/5">
                <input 
                  type="text" 
                  className="w-full bg-transparent px-4 py-3 text-center text-slate-200 placeholder-slate-500 outline-none font-medium" 
                  placeholder="What is your main objective?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isActive}
                />
              </div>
              <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1">
                <Award size={12} /> Earn +15 XP upon completion
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FocusMode;
