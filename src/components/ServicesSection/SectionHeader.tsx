import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  onOpenModal: () => void;
}

const SectionHeader = ({ onOpenModal }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        Recursos Inteligentes
      </h2>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        Transforme a maneira como sua empresa interage com clientes através de assistentes virtuais alimentados por IA.
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenModal}
        className="px-8 py-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors duration-200 text-lg font-semibold backdrop-blur-sm"
      >
        Saiba Mais
      </motion.button>
    </motion.div>
  );
};

export default SectionHeader;