import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-8 shadow-lg text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
        <Icon size={32} className="text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        {title}
      </h2>
      <p className="text-gray-400">
        {description}
      </p>
    </motion.div>
  );
};