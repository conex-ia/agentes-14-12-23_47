import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrainingData } from '../../../hooks/useTrainingData';
import { useKnowledgeBases } from '../../../hooks/useKnowledgeBases';
import useAuth from '../../../stores/useAuth';
import TrainingModal from './TrainingModal';
import DeleteBaseModal from './DeleteBaseModal';
import TrainingHeader from './TrainingHeader';
import ContentHeader from './ContentHeader';
import TrainingGrid from './TrainingGrid';
import KnowledgeBaseGrid from './KnowledgeBaseGrid';
import AddKnowledgeBaseModal from './AddKnowledgeBaseModal';

const Training = () => {
  const { trainings, loading: trainingsLoading } = useTrainingData();
  const { bases, loading: basesLoading } = useKnowledgeBases();
  const { userUid, empresaUid } = useAuth();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addBaseModal, setAddBaseModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<{ id: string, phase: string } | null>(null);
  
  // Loading states
  const [isAddingBase, setIsAddingBase] = useState(false);
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [isDeletingTraining, setIsDeletingTraining] = useState<string | null>(null);
  
  // Pagination states
  const [currentTrainingPage, setCurrentTrainingPage] = useState(1);
  const [currentBasePage, setCurrentBasePage] = useState(1);
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    training?: {
      id: string;
      tipo: string;
      origem: string;
      resumo: string;
    };
  }>({ isOpen: false });

  // Handlers for base management
  const handleAddBase = () => {
    setAddBaseModal(true);
  };

  const handleConfirmAddBase = async (name: string) => {
    if (!empresaUid || !userUid) return;
    setIsAddingBase(true);

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciartabela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'criarTabela',
          empresaUid,
          userUid,
          nome: name
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setAddBaseModal(false);
      } else {
        throw new Error('Failed to create base');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsAddingBase(false);
    }
  };

  // Handlers for content management
  const handleAddContent = async () => {
    if (isAddingContent || !empresaUid || !userUid) return;
    
    setIsAddingContent(true);
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciarbase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'adicionar',
          empresaUid,
          userUid
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success' && data.baseUid) {
        handleOpenModal(data.baseUid, 'aguardando');
      }
    } catch (error) {
      console.error('Error adding content:', error);
    } finally {
      setIsAddingContent(false);
    }
  };

  // Modal handlers
  const handleOpenModal = (id: string, phase: string) => {
    setSelectedTraining({ id, phase });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTraining(null);
  };

  const handleOpenDeleteModal = (training: any) => {
    setDeleteModal({
      isOpen: true,
      training: {
        id: training.uid,
        tipo: training.tipo,
        origem: training.origem,
        resumo: training.resumo
      }
    });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.training?.id || isDeletingTraining || !empresaUid || !userUid) return;
    
    setIsDeletingTraining(deleteModal.training.id);
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciarbase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'excluir',
          empresaUid,
          userUid,
          baseUid: deleteModal.training.id
        }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        handleCloseDeleteModal();
      }
    } catch (error) {
      console.error('Error deleting training:', error);
    } finally {
      setIsDeletingTraining(null);
    }
  };

  if (trainingsLoading || basesLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4"
      >
        <div className="max-w-[1370px] mx-auto">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
            <div className="text-center text-gray-400">Carregando...</div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full px-4"
      >
        <div className="max-w-[1370px] mx-auto space-y-6">
          <TrainingHeader 
            onAddBase={handleAddBase}
            isAddingBase={isAddingBase}
          />

          <KnowledgeBaseGrid
            bases={bases}
            currentPage={currentBasePage}
            onPageChange={setCurrentBasePage}
          />
          
          <ContentHeader 
            onAddContent={handleAddContent}
            isAddingContent={isAddingContent}
          />

          <TrainingGrid 
            trainings={trainings}
            currentPage={currentTrainingPage}
            onPageChange={setCurrentTrainingPage}
            onOpenModal={handleOpenModal}
            onOpenDeleteModal={handleOpenDeleteModal}
            isDeletingTraining={isDeletingTraining}
          />
        </div>
      </motion.div>

      <TrainingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        trainingId={selectedTraining?.id}
        currentPhase={selectedTraining?.phase}
      />

      <DeleteBaseModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        tipo={deleteModal.training?.tipo || ''}
        origem={deleteModal.training?.origem || ''}
        resumo={deleteModal.training?.resumo || ''}
        isDeleting={Boolean(isDeletingTraining)}
      />

      <AddKnowledgeBaseModal
        isOpen={addBaseModal}
        onClose={() => setAddBaseModal(false)}
        onConfirm={handleConfirmAddBase}
        isAdding={isAddingBase}
      />
    </>
  );
};

export default Training;