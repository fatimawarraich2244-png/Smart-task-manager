import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Timer, LineChart, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { logout } = useAuth();

  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/focus', icon: <Timer size={20} />, label: 'Focus Mode' },
    { to: '/analytics', icon: <LineChart size={20} />, label: 'Analytics' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-surface/50 backdrop-blur-2xl border-r border-white/10 flex flex-col z-50">
      <div className="h-[64px] flex items-center px-6 border-b border-white/10 group cursor-default">
        <motion.h2 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-black text-gradient drop-shadow-lg"
        >
          SmartTask
        </motion.h2>
      </div>

      <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 relative ${
                isActive ? 'text-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-primary/15 border-l-4 border-primary rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.span 
                  whileHover={{ rotate: isActive ? 0 : [0, -15, 15, 0], scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  {link.icon}
                </motion.span>
                <span className="relative z-10">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <motion.button 
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-slate-400 font-bold hover:text-red-400 hover:bg-red-500/10 transition-colors group"
        >
          <motion.div whileHover={{ rotate: -15 }} transition={{ type: "spring", stiffness: 300 }}>
            <LogOut size={18} />
          </motion.div>
          <span>Logout</span>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
