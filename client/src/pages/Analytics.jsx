import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';
import Heatmap from '../components/Heatmap';
import AnimatedCounter from '../components/AnimatedCounter';
import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Percent, Timer, Loader } from 'lucide-react';

const Analytics = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getAnalytics(token);
      setData(res);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader className="animate-spin w-12 h-12 text-primary mb-4" />
        <p className="text-slate-400 font-medium">Crunching your numbers...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Tasks Completed', value: data?.tasks?.completed || 0, icon: <CheckCircle2 size={24} />, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Tasks Pending', value: data?.tasks?.pending || 0, icon: <CircleDashed size={24} />, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Completion Rate', value: `${data?.tasks?.completionRate || 0}%`, icon: <Percent size={24} />, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Focus Time', value: `${Math.round((data?.focus?.totalTime || 0) / 60)}h`, icon: <Timer size={24} />, color: 'text-danger', bg: 'bg-danger/10' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gradient mb-8">Your Performance</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card flex items-center gap-4"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-lg`}>
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {stat.icon}
              </motion.div>
            </div>
            <div>
              <h3 className="text-4xl font-black text-slate-100 leading-tight">
                <AnimatedCounter value={stat.value} delay={0.1 + (i * 0.1)} />
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h3 className="text-lg font-bold mb-6">Task Priority Breakdown</h3>
          <div className="flex flex-col gap-5">
            {[
              { label: 'High', count: data?.priority?.high || 0, color: 'bg-danger' },
              { label: 'Medium', count: data?.priority?.medium || 0, color: 'bg-warning' },
              { label: 'Low', count: data?.priority?.low || 0, color: 'bg-success' }
            ].map(p => (
              <div key={p.label} className="flex items-center gap-4">
                <span className="w-16 text-sm font-medium text-slate-400">{p.label}</span>
                <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data?.tasks?.total ? (p.count / data.tasks.total) * 100 : 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${p.color} shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)]`}
                  />
                </div>
                <span className="w-8 text-right font-bold text-slate-200">{p.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <h3 className="text-lg font-bold mb-6">Weekly Activity</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 group">
              <span className="text-slate-400 font-medium group-hover:text-primary transition-colors">Tasks Completed</span>
              <span className="text-3xl font-black text-slate-100">
                <AnimatedCounter value={data?.weekly?.tasksCompleted || 0} />
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5 group">
              <span className="text-slate-400 font-medium group-hover:text-primary transition-colors">Focus Sessions</span>
              <span className="text-3xl font-black text-slate-100">
                <AnimatedCounter value={data?.weekly?.sessions || 0} />
              </span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-slate-400 font-medium group-hover:text-primary transition-colors">Focus Minutes</span>
              <span className="text-3xl font-black text-slate-100">
                <AnimatedCounter value={`${data?.weekly?.focusTime || 0}m`} />
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Heatmap data={data?.heatmap || []} />
      </motion.div>
    </div>
  );
};

export default Analytics;
