import { useState } from 'react';
import useAuth from '../../../stores/useAuth';
import { Bot } from '../../../types/bot';

interface ConfirmModalState {
  isOpen: boolean;
  botId?: string;
  botName?: string;
  botImage?: string | null;
  action?: 'pause' | 'delete';
}

interface SyncModalState {
  isOpen: boolean;
  botId?: string;
  botName?: string;
  botImage?: string | null;
}

export function useAssistantActions() {
  const { userUid } = useAuth();
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ isOpen: false });
  const [syncModal, setSyncModal] = useState<SyncModalState>({ isOpen: false });

  const handleOpenSyncModal = (bot: Bot) => {
    setSyncModal({
      isOpen: true,
      botId: bot.uid,
      botName: bot.bot_nome,
      botImage: bot.bot_perfil
    });
  };

  const handleCloseSyncModal = () => {
    setSyncModal({ isOpen: false });
  };

  const handleOpenConfirmModal = (bot: Bot, action: 'pause' | 'delete') => {
    setConfirmModal({
      isOpen: true,
      botId: bot.uid,
      botName: bot.bot_nome,
      botImage: bot.bot_perfil,
      action
    });
  };

  const handleCloseConfirmModal = () => {
    setConfirmModal({ isOpen: false });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.botId || !confirmModal.action || !userUid || isProcessingAction) {
      return { success: false, message: 'Erro ao processar ação' };
    }

    setIsProcessingAction(true);

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/gerenciar-assistente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: confirmModal.action,
          assistenteId: confirmModal.botId,
          userId: userUid,
        }),
      });

      const data = await response.json();
      return {
        success: true,
        message: `Assistente ${data.status === 'pausado' ? 'pausado' : 'excluído'} com sucesso`,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao processar sua solicitação. Por favor, tente novamente.',
      };
    } finally {
      setIsProcessingAction(false);
    }
  };

  return {
    confirmModal,
    syncModal,
    isProcessingAction,
    handleOpenSyncModal,
    handleCloseSyncModal,
    handleOpenConfirmModal,
    handleCloseConfirmModal,
    handleConfirmAction
  };
}