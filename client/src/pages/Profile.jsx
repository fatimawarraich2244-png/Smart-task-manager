import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import ProgressBar from '../components/ProgressBar';
import { xpProgress, getLevelTitle } from '../utils/xpCalculator';
import AnimatedCounter from '../components/AnimatedCounter';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Edit3, Save, X, Star } from 'lucide-react';

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = await authService.updateProfile(token, { name });
      updateUser(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const progress = xpProgress(user?.xp || 0);
  const title = getLevelTitle(user?.level || 1);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gradient mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="glass-card md:col-span-1 flex flex-col items-center text-center p-8 relative overflow-hidden"
        >
          {/* Animated Background Aura */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative mb-6">
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute -inset-2 rounded-full border-2 border-dashed border-primary/40"
            />
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-32 h-32 rounded-full bg-surface/40 backdrop-blur-md border-4 border-primary flex items-center justify-center text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary shadow-[0_0_30px_rgba(99,102,241,0.3)] relative z-10"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </motion.div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleUpdate} className="w-full">
              <input 
                type="text" 
                className="form-input text-center font-bold text-lg mb-4" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="flex gap-2 justify-center">
                <button type="button" className="btn btn-secondary px-3" onClick={() => setIsEditing(false)}>
                  <X size={18} />
                </button>
                <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                  {loading ? '...' : <Save size={18} />}
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-100 mb-1">{user?.name}</h2>
              <div className="flex items-center justify-center gap-1.5 text-sm text-slate-400 mb-6">
                <Mail size={14} /> {user?.email}
              </div>
              <button className="btn btn-secondary text-sm px-4" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} /> Edit Profile
              </button>
            </>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card md:col-span-2 p-8"
        >
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold">Level Progress</h3>
            <span className="badge badge-pending px-3 py-1.5 text-xs">{title}</span>
          </div>

          <div className="flex justify-center mb-12 relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-purple-500/20 blur-3xl rounded-full"
            />
            <motion.div 
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-48 h-48 rounded-[2rem] rotate-3 bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center text-white shadow-[0_0_50px_rgba(99,102,241,0.5)] cursor-default overflow-hidden"
            >
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent w-full h-1/2 rounded-t-[2rem]" />
              
              <Star size={24} className="absolute top-4 right-4 text-yellow-300 opacity-80" />
              <span className="text-sm font-bold opacity-90 tracking-[0.3em] mb-1 z-10">LEVEL</span>
              <span className="text-8xl font-black leading-none z-10 drop-shadow-lg">
                <AnimatedCounter value={user?.level || 1} />
              </span>
            </motion.div>
          </div>

          <ProgressBar 
            progress={progress} 
            label="XP to Next Level" 
            color="bg-gradient-to-r from-primary via-secondary to-purple-500" 
          />
          <p className="text-center text-slate-400 mt-6 font-medium text-lg">
            Total Lifetime XP: <span className="text-primary font-black text-2xl ml-2"><AnimatedCounter value={user?.xp || 0} /></span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
