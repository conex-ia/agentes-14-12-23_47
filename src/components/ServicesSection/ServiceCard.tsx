import React from 'react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const ServiceCard = ({ title, description, icon, index }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        y: -5 
      }}
      className="bg-white/10 backdrop-blur-sm p-6 rounded-xl transition-all duration-300 hover:bg-white/15 min-w-[300px] max-w-[400px] w-full flex-shrink-0"
    >
      <motion.div 
        className="text-emerald-400 mb-4"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default ServiceCard;