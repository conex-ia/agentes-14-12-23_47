import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { EmptyState } from '../../EmptyState';
import { AssistantTable } from './components/AssistantTable';
import { useBots } from '../../hooks/useBots';
import { useKnowledgeBases } from '../../hooks/useKnowledgeBases';
import { ITEMS_PER_PAGE } from './constants';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SyncAssistantModal } from './components/SyncAssistantModal';
import { useAssistantActions } from './hooks/useAssistantActions';
import { useAssistantPagination } from './hooks/useAssistantPagination';

const AssistantGrid = () => {
  const { bots, loading: botsLoading } = useBots();
  const { bases, loading: basesLoading } = useKnowledgeBases();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<{ [key: string]: string }>({});

  const {
    confirmModal,
    syncModal,
    handleOpenSyncModal,
    handleCloseSyncModal,
    handleOpenConfirmModal,
    handleCloseConfirmModal,
    handleConfirmAction,
    isProcessingAction
  } = useAssistantActions();

  const {
    currentPage,
    setCurrentPage,
    currentBots,
    totalPages
  } = useAssistantPagination(bots, ITEMS_PER_PAGE);

  const handleKnowledgeBaseChange = async (botId: string, baseId: string) => {
    setSelectedKnowledgeBases(prev => ({ ...prev, [botId]: baseId }));
    // API call to update bot's knowledge base will be implemented here
  };

  if (botsLoading || basesLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-8 shadow-lg"
      >
        <div className="text-center text-gray-400">Carregando...</div>
      </motion.div>
    );
  }

  if (!bots.length) {
    return (
      <EmptyState
        icon={Bot}
        title="Nenhum assistente criado ainda"
        description="Crie seu primeiro assistente para começar"
      />
    );
  }

  return (
    <div className="w-full px-4">
      <div className="max-w-[1370px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-8 shadow-lg"
        >
          <AssistantTable
            bots={currentBots}
            bases={bases}
            selectedKnowledgeBases={selectedKnowledgeBases}
            onKnowledgeBaseChange={handleKnowledgeBaseChange}
            onSync={handleOpenSyncModal}
            onMenuClick={(id) => setOpenMenuId(id === openMenuId ? null : id)}
            onAction={handleOpenConfirmModal}
            openMenuId={openMenuId}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      </div>

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmAction}
        title={`${confirmModal.action === 'pause' ? 'Pausar' : 'Excluir'} Assistente`}
        assistantName={confirmModal.botName || ''}
        assistantImage={confirmModal.botImage}
        actionType={confirmModal.action || 'pause'}
        isProcessing={isProcessingAction}
      />

      <SyncAssistantModal
        isOpen={syncModal.isOpen}
        onClose={handleCloseSyncModal}
        assistantName={syncModal.botName || ''}
        assistantImage={syncModal.botImage || ''}
        assistantId={syncModal.botId || ''}
      />
    </div>
  );
};

export default AssistantGrid;