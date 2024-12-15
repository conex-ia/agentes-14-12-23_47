import React from 'react';
import { motion } from 'framer-motion';
import { BookText, Plus } from 'lucide-react';

interface ContentHeaderProps {
  onAddContent: () => void;
  isAddingContent: boolean;
}

const ContentHeader = ({ onAddContent, isAddingContent }: ContentHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4 sm:p-6 md:p-8 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <BookText size={24} className="sm:w-8 sm:h-8 text-emerald-500" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            Gerenciar Conteúdo do Treinamento
          </h1>
        </div>
        <button
          onClick={onAddContent}
          disabled={isAddingContent}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span>{isAddingContent ? 'Adicionando...' : 'Adicionar Conteúdo'}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ContentHeader;