import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ success: boolean; message: string }>;
  title: string;
  assistantName: string;
  assistantImage?: string | null;
  actionType: 'pause' | 'delete';
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  assistantName,
  assistantImage,
  actionType,
}: ConfirmationModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setResult(null);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const result = await onConfirm();
      setResult(result);
    } catch (error) {
      setResult({
        success: false,
        message: 'Erro ao processar sua solicitação. Por favor, tente novamente.'
      });
    }
    setIsProcessing(false);
  };

  const handleClose = () => {
    setIsProcessing(false);
    setResult(null);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={result ? handleClose : undefined}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors z-10"
              >
                <X size={20} />
              </motion.button>

              <div className="p-6">
                <div className="flex flex-col items-center">
                  {result ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{assistantName}</h3>
                      <p className="text-gray-400 mb-6">{result.message}</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleClose}
                        className="w-full py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Fechar
                      </motion.button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-4">
                        {assistantImage ? (
                          <img
                            src={assistantImage}
                            alt={assistantName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-700" />
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                      <p className="text-gray-400 text-center mb-2">{assistantName}</p>
                      <p className="text-red-400 text-sm text-center mb-6">
                        Esta ação é irreversível!
                      </p>

                      <div className="flex gap-4 w-full">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleClose}
                          disabled={isProcessing}
                          className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancelar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleConfirm}
                          disabled={isProcessing}
                          className={`flex-1 py-2 px-4 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            actionType === 'delete' 
                              ? 'bg-red-500 hover:bg-red-600' 
                              : 'bg-emerald-500 hover:bg-emerald-600'
                          }`}
                        >
                          {isProcessing ? 'Processando...' : 'Continuar'}
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;