import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database } from 'lucide-react';

interface AddKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => Promise<void>;
  isAdding: boolean;
}

const AddKnowledgeBaseModal = ({
  isOpen,
  onClose,
  onConfirm,
  isAdding
}: AddKnowledgeBaseModalProps) => {
  const [name, setName] = useState('');

  // Reset input when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    try {
      await onConfirm(name.trim());
      setName('');
    } catch (error) {
      // Silently handle error - just close modal
      onClose();
    }
  };

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
              className="relative w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Database size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Adicionar Base
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Escolha um nome para o treinamento
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Digite o nome da base"
                      disabled={isAdding}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isAdding}
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isAdding || !name.trim()}
                      className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAdding ? 'Adicionando...' : 'Confirmar'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddKnowledgeBaseModal;