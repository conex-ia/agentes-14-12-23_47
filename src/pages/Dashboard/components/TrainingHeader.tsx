import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus } from 'lucide-react';

interface TrainingHeaderProps {
  onAddBase: () => void;
  isAddingTraining: boolean;
}

const TrainingHeader = ({ onAddBase, isAddingTraining }: TrainingHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4 sm:p-6 md:p-8 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <GraduationCap size={24} className="sm:w-8 sm:h-8 text-emerald-500" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            Gerenciar Base de Conhecimento
          </h1>
        </div>
        <button
          onClick={onAddBase}
          disabled={isAddingTraining}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>{isAddingTraining ? 'Adicionando...' : 'Adicionar Base'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default TrainingHeader;