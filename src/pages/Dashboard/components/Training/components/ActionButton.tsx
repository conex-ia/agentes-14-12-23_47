import React from 'react';
import { BookPlus, Trash2 } from 'lucide-react';
import { ActionButtonProps } from '../types';

export const ActionButton = ({
  training,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}: ActionButtonProps) => {
  const isAwaiting = training.fase === 'aguardando';

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-1">
        {isAwaiting ? (
          <div className="flex flex-col items-center">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => onOpenModal(training.uid, training.fase)}
                  className="w-12 h-12 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <BookPlus size={24} className="text-emerald-500" />
                </button>
                <span className="text-[9px] text-gray-400 mt-1">
                  adicionar
                </span>
              </div>
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => onOpenDeleteModal(training)}
                  disabled={isDeletingTraining === training.uid}
                  className="w-12 h-12 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={24} className="text-red-500" />
                </button>
                <span className="text-[9px] text-gray-400 mt-1">
                  excluir
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <button 
              onClick={() => onOpenDeleteModal(training)}
              disabled={isDeletingTraining === training.uid}
              className="w-12 h-12 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={24} className="text-red-500" />
            </button>
            <span className="text-[9px] text-gray-400 mt-1">
              excluir
            </span>
          </div>
        )}
      </div>
    </div>
  );
};