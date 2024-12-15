import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircle2, 
  GraduationCap,
  Bot, 
  BarChart2, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../stores/useAuth';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userName: string;
  userProfile?: string;
  activeScreen: string;
  setActiveScreen: (screen: 'dashboard' | 'training') => void;
}

const Sidebar = ({ 
  isCollapsed, 
  onToggle, 
  userName, 
  userProfile,
  activeScreen,
  setActiveScreen 
}: SidebarProps) => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const handleScreenChange = (screen: 'dashboard' | 'training') => {
    setActiveScreen(screen);
  };

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      screen: 'dashboard' as const,
      active: activeScreen === 'dashboard'
    },
    { 
      icon: GraduationCap, 
      label: 'Treinamento', 
      screen: 'training' as const,
      active: activeScreen === 'training'
    },
    { icon: Bot, label: 'Assistentes', screen: null, active: false },
    { icon: BarChart2, label: 'Estatísticas', screen: null, active: false },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      className="fixed left-0 top-0 h-screen bg-gray-800 text-white flex flex-col shadow-xl"
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center overflow-hidden">
            {userProfile ? (
              <img 
                src={userProfile} 
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle2 size={40} />
            )}
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-center"
            >
              <p className="font-medium text-sm">{userName}</p>
            </motion.div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => item.screen && handleScreenChange(item.screen)}
                className={`w-full flex items-center py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                  item.active ? 'bg-gray-700 text-white' : ''
                } ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
              >
                <item.icon size={isCollapsed ? 28 : 24} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="ml-3"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            </li>
          ))}
          <li>
            <div
              className={`w-full flex items-center py-2 text-gray-300 ${
                isCollapsed ? 'justify-center px-0' : 'px-4'
              }`}
            >
              <ArrowUpRight size={isCollapsed ? 28 : 24} />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3"
                >
                  Seta
                </motion.span>
              )}
            </div>
          </li>
        </ul>
      </nav>

      <button 
        onClick={handleLogout}
        className={`p-4 flex items-center text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border-t border-gray-700 ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <LogOut size={isCollapsed ? 28 : 24} />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3"
          >
            Sair
          </motion.span>
        )}
      </button>

      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight size={14} />
        ) : (
          <ChevronLeft size={14} />
        )}
      </button>
    </motion.aside>
  );
};

export default Sidebar;