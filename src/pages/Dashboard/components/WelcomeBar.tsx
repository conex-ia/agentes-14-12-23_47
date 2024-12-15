import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeBarProps {
  userName: string;
  activeScreen?: 'dashboard' | 'training';
}

const WelcomeBar = ({ userName, activeScreen = 'dashboard' }: WelcomeBarProps) => {
  return (
    <div className="w-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-[1370px] mx-auto min-w-[300px]"
      >
        <h1 className="text-xl md:text-2xl font-bold text-white truncate">
          Bem-vindo a ConexIA, <span className="text-emerald-400">{userName}</span>!
        </h1>
      </motion.div>
    </div>
  );
};

export default WelcomeBar;