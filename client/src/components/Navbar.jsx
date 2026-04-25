import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 right-0 left-[260px] h-[64px] bg-surface/50 backdrop-blur-2xl border-b border-white/10 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        <div></div>
        
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </motion.button>

          <div className="flex items-center gap-4 border-l border-white/10 pl-6 cursor-default">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-200">{user?.name}</p>
              <motion.p 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-xs font-black tracking-widest text-primary uppercase"
              >
                Lvl {user?.level || 1}
              </motion.p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border-2 border-surface cursor-pointer"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
