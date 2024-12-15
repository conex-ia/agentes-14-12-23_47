import React, { useState } from 'react';
import { useTrainingData } from '../../../hooks/useTrainingData';
import { useKnowledgeBases } from '../../../hooks/useKnowledgeBases';
import useAuth from '../../../stores/useAuth';
import { LoadingState } from './components/LoadingState';
import { TrainingContainer } from './components/TrainingContainer';
import { ContentHeader } from './components/ContentHeader';
import { TrainingGrid } from './components/TrainingGrid';
import { TrainingModal } from './components/TrainingModal';
import { DeleteBaseModal } from './components/DeleteBaseModal';
import { KnowledgeBaseGrid } from '../KnowledgeBase';
import { AddKnowledgeBaseModal } from './components/AddKnowledgeBaseModal';
import { TrainingHeader } from './components/TrainingHeader';

export const Training = () => {
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
      }
    } catch (error) {
      console.error('Error creating base:', error);
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

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false });
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
    return <LoadingState />;
  }

  return (
    <TrainingContainer>
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
    </TrainingContainer>
  );
};