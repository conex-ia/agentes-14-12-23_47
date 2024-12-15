import { useState } from 'react';
import useAuth from '../../../../../stores/useAuth';
import { KnowledgeBase } from '../../../../../hooks/useKnowledgeBases';

interface DeleteModalState {
  isOpen: boolean;
  base?: KnowledgeBase;
}

export const useKnowledgeBaseActions = () => {
  const { userUid, empresaUid } = useAuth();
  const [isDeletingBase, setIsDeletingBase] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({ isOpen: false });

  const handleOpenDeleteModal = (base: KnowledgeBase) => {
    setDeleteModal({ isOpen: true, base });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.base?.uid || !empresaUid || !userUid || isDeletingBase) return;

    setIsDeletingBase(deleteModal.base.uid);
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciartabela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'excluirTabela',
          empresaUid,
          userUid,
          baseUid: deleteModal.base.uid
        }),
      });

      const data = await response.json();
      
      if (data.message === "Workflow was started") {
        handleCloseDeleteModal();
      }
    } catch (error) {
      console.error('Error deleting base:', error);
    } finally {
      setIsDeletingBase(null);
    }
  };

  return {
    isDeletingBase,
    deleteModal,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleConfirmDelete
  };
};