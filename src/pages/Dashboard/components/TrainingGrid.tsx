import React from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import Pagination from '../../../components/Pagination';
import { EmptyState } from '../../../components/EmptyState';
import { ActionButton } from './Training/components/ActionButton';
import { StatusIndicator } from './Training/components/StatusIndicator';
import { formatDate } from './Training/utils/dateFormat';
import { TrainingGridProps } from './Training/types';
import { ITEMS_PER_PAGE } from './Training/constants';

const TrainingGrid = ({
  trainings,
  currentPage,
  onPageChange,
  onOpenModal,
  onOpenDeleteModal,
  isDeletingTraining
}: TrainingGridProps) => {
  if (!trainings || trainings.length === 0) {
    return (
      <EmptyState
        icon={Database}
        title="Ainda não existem treinamentos cadastrados"
        description="Clique em 'Adicionar Conteúdo' para começar a criar seus treinamentos."
      />
    );
  }

  const totalPages = Math.ceil(trainings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTrainings = trainings.slice(startIndex, endIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="p-4 font-medium">Criada</th>
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium">Origem</th>
              <th className="p-4 font-medium">Resumo</th>
              <th className="p-4 font-medium">Base</th>
              <th className="p-4 font-medium text-center">Status</th>
              <th className="p-4 font-medium text-center w-48">Gestão</th>
            </tr>
          </thead>
          <tbody>
            {currentTrainings.map((training) => (
              <tr key={training.uid} className="border-b border-gray-700/50">
                <td className="p-4 text-white">
                  {formatDate(training.created_at)}
                </td>
                <td className="p-4 text-white">{training.tipo}</td>
                <td className="p-4 text-white">{training.origem}</td>
                <td className="p-4 text-white">{training.resumo}</td>
                <td className="p-4 text-white">{training.base}</td>
                <td className="p-4">
                  <StatusIndicator phase={training.fase} />
                </td>
                <td className="p-4">
                  <ActionButton
                    training={training}
                    onOpenModal={onOpenModal}
                    onOpenDeleteModal={onOpenDeleteModal}
                    isDeletingTraining={isDeletingTraining}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </motion.div>
  );
};

export default TrainingGrid;