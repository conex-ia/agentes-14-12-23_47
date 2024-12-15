import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database } from 'lucide-react';
import { KnowledgeBase } from '../../../../hooks/useKnowledgeBases';
import { EmptyState } from '../../../../components/EmptyState';
import { KnowledgeBaseTable } from './components/KnowledgeBaseTable';
import { DeleteKnowledgeBaseModal } from './components/DeleteKnowledgeBaseModal';
import { ViewKnowledgeBaseModal } from './components/ViewKnowledgeBaseModal';
import { useKnowledgeBaseActions } from './hooks/useKnowledgeBaseActions';
import { ITEMS_PER_PAGE } from './constants';
import Pagination from '../../../../components/Pagination';

interface KnowledgeBaseGridProps {
  bases: KnowledgeBase[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const KnowledgeBaseGrid = ({
  bases,
  currentPage,
  onPageChange
}: KnowledgeBaseGridProps) => {
  const {
    isDeletingBase,
    deleteModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete
  } = useKnowledgeBaseActions();

  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    base: KnowledgeBase | null;
  }>({ isOpen: false, base: null });

  const handleOpenViewModal = (base: KnowledgeBase) => {
    setViewModal({ isOpen: true, base });
  };

  const handleCloseViewModal = () => {
    setViewModal({ isOpen: false, base: null });
  };

  const totalPages = Math.ceil(bases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBases = bases.slice(startIndex, endIndex);

  if (bases.length === 0) {
    return (
      <EmptyState
        icon={Database}
        title="Ainda não existem Bases de Conhecimento"
        description="Clique em 'Adicionar Base' para começar a criar suas bases de conhecimento."
      />
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <KnowledgeBaseTable
          bases={currentBases}
          onOpenDeleteModal={handleOpenDeleteModal}
          onOpenViewModal={handleOpenViewModal}
          isDeletingBase={isDeletingBase}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </motion.div>

      <DeleteKnowledgeBaseModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        nome={deleteModal.base?.nome || ''}
        treinamentos={deleteModal.base?.treinamentos_qtd || 0}
        isDeleting={Boolean(isDeletingBase)}
      />

      <ViewKnowledgeBaseModal
        isOpen={viewModal.isOpen}
        onClose={handleCloseViewModal}
        base={viewModal.base}
      />
    </>
  );
};

export default KnowledgeBaseGrid;