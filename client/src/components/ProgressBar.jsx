import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const ProgressBar = ({ progress, label, color = 'bg-primary' }) => {
  const [isGaining, setIsGaining] = useState(false);
  const prevProgressRef = useRef(progress);

  useEffect(() => {
    if (progress > prevProgressRef.current) {
      setIsGaining(true);
      const timer = setTimeout(() => setIsGaining(false), 1500);
      return () => clearTimeout(timer);
    }
    prevProgressRef.current = progress;
  }, [progress]);

  return (
    <div className="w-full mb-4">
      {label && (
        <div className="flex justify-between items-center mb-2 text-sm font-medium">
          <span className="text-slate-400">{label}</span>
          <motion.span 
            animate={{ 
              scale: isGaining ? [1, 1.3, 1] : 1, 
              color: isGaining ? '#f59e0b' : '#e2e8f0',
              textShadow: isGaining ? "0px 0px 8px rgba(245,158,11,0.8)" : "none"
            }}
            transition={{ duration: 0.5 }}
            className="text-slate-200"
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      )}
      <div className="w-full h-2 bg-white/10 rounded-full relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ 
            width: `${progress}%`,
            filter: isGaining 
              ? ["brightness(1)", "brightness(1.5)", "brightness(1)", "brightness(1.3)", "brightness(1)"] 
              : "brightness(1)",
            boxShadow: isGaining 
              ? ["0px 0px 8px rgba(99,102,241,0.5)", "0px 0px 20px rgba(245,158,11,0.8)", "0px 0px 8px rgba(99,102,241,0.5)"]
              : "0px 0px 8px rgba(99,102,241,0.4)"
          }}
          transition={{ 
            width: { duration: 1, ease: "easeOut" },
            filter: { duration: 0.8, ease: "easeInOut" },
            boxShadow: { duration: 1.5, ease: "easeInOut" }
          }}
          className={`absolute top-0 left-0 h-full rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] ${color} z-10`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
