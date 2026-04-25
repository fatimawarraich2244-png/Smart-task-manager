import { motion } from 'framer-motion';

const Heatmap = ({ data }) => {
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split('T')[0];
  });

  const getIntensityClass = (count) => {
    if (!count) return 'bg-white/5';
    if (count === 1) return 'bg-emerald-500/30';
    if (count <= 3) return 'bg-emerald-500/50';
    if (count <= 5) return 'bg-emerald-500/80';
    return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  };

  const dataMap = data?.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {}) || {};

  return (
    <div className="glass-card mt-6">
      <h3 className="text-lg font-bold mb-4">Activity Map (Last 30 Days)</h3>
      <div className="flex flex-wrap gap-1.5">
        {days.map((day, i) => {
          const count = dataMap[day] || 0;
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.01 }}
              key={day} 
              className={`w-4 h-4 rounded-sm ${getIntensityClass(count)} hover:scale-125 transition-transform cursor-pointer`}
              title={`${day}: ${count} tasks completed`}
            />
          );
        })}
      </div>
      
      <div className="flex items-center gap-2 mt-6 text-xs text-slate-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-white/5"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-500/30"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-500/50"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-500/80"></div>
        <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default Heatmap;
