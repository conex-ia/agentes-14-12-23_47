import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  nome: string;
  treinamentos: number;
  isDeleting: boolean;
}

export const DeleteKnowledgeBaseModal: React.FC<DeleteKnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  nome,
  treinamentos,
  isDeleting
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle size={24} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Excluir Base de Conhecimento
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="w-full bg-gray-700/50 rounded-lg p-4 space-y-2 mb-4">
                  <div>
                    <span className="text-sm text-gray-400">Nome da Base:</span>
                    <p className="text-white">{nome}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Treinamentos Vinculados:</span>
                    <p className="text-white">{treinamentos}</p>
                  </div>
                </div>

                <p className="text-red-400 text-sm text-center mb-6">
                  Esta ação é irreversível! A base de conhecimento e todos os seus treinamentos serão excluídos permanentemente.
                </p>

                <div className="flex gap-4 w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    disabled={isDeleting}
                    className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 
                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
                             transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};