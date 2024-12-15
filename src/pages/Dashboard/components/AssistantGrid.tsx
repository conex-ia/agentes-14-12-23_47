import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Plus, Wifi, QrCode, MoreVertical, Pause, Trash2 } from 'lucide-react';
import { useBots } from '../../../hooks/useBots';
import useAuth from '../../../stores/useAuth';
import ConfirmationModal from './ConfirmationModal';
import SyncAssistantModal from './SyncAssistantModal';

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

const DEFAULT_PROFILE_IMAGE = 'https://tfmzozvazfbrapkzxrcz.supabase.co/storage/v1/object/public/conexia/bot-perfil.png';

const AssistantGrid = () => {
  const { userUid } = useAuth();
  const { bots, loading } = useBots();
  const [currentPage, setCurrentPage] = useState(1);
  const [assistantName, setAssistantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ isOpen: false });
    const [syncModal, setSyncModal] = useState<SyncModalState>({ isOpen: false });
    const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<{ [botId: string]: string }>({});


  const itemsPerPage = 5;
  const totalPages = Math.ceil((bots?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBots = bots?.slice(startIndex, endIndex) || [];

    // Update current page when bots array changes
    useEffect(() => {
      if (currentPage > 1 && currentBots.length === 0 && totalPages > 0) {
          setCurrentPage(Math.max(1, totalPages));
      }
  }, [bots?.length, currentPage, totalPages]);


  const getBotNameWithoutExtension = (fullName: string) => {
    return fullName.split('.')[0];
  };

  const isNameTaken = (name: string) => {
    return bots?.some(bot => getBotNameWithoutExtension(bot.bot_nome) === name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate names before submitting
    if (isNameTaken(assistantName)) {
      setErrorMessage(`O nome "${assistantName}" já está em uso. Por favor, escolha outro nome.`);
      setTimeout(() => setErrorMessage(''), 8000);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/gerenciar-assistente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'criarAssistente',
          nome: assistantName,
          userId: userUid,
        }),
      });

      const data = await response.json();

      if (data.status === 'criado') {
        setSuccessMessage('Assistente criado com sucesso');
        setAssistantName('');
        setTimeout(() => setSuccessMessage(''), 8000);
      } else {
        setErrorMessage('Erro ao criar assistente. Por favor, tente novamente.');
        setTimeout(() => setErrorMessage(''), 8000);
      }
    } catch (err) {
      setErrorMessage('Erro ao criar assistente. Por favor, tente novamente.');
      setTimeout(() => setErrorMessage(''), 8000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuClick = (botId: string) => {
    setOpenMenuId(openMenuId === botId ? null : botId);
  };

  const handleSyncClick = (bot: any) => {
      setSyncModal({
          isOpen: true,
          botId: bot.uid,
          botName: bot.bot_nome,
          botImage: bot.bot_perfil || DEFAULT_PROFILE_IMAGE,
      });
  };


    const handleActionClick = (bot: any, action: 'pause' | 'delete') => {
      setConfirmModal({
          isOpen: true,
          botId: bot.uid,
          botName: getBotNameWithoutExtension(bot.bot_nome),
          botImage: bot.bot_perfil || DEFAULT_PROFILE_IMAGE,
          action,
      });
      setOpenMenuId(null);
  };

  const handleConfirmAction = async () => {
      if (!confirmModal.botId || !confirmModal.action) return { success: false, message: 'Erro ao processar ação' };

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
      }
  };

    const handleKnowledgeBaseChange = (botId: string, value: string) => {
        setSelectedKnowledgeBases(prev => ({ ...prev, [botId]: value }));
    };

    const knowledgeBaseOptions = [
        { value: '', label: 'Escolha uma base' },
        { value: 'base1', label: 'Base de Conhecimento 1' },
        { value: 'base2', label: 'Base de Conhecimento 2' },
        { value: 'base3', label: 'Base de Conhecimento 3' },
    ];


  if (loading) {
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

  return (
    <div className="w-full px-4">
      <div className="max-w-[1370px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-8 shadow-lg"
        >
          {bots.length === 0 ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                <Bot size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Nenhum assistente criado ainda
              </h2>
              <p className="text-gray-400 mb-8">
                Crie seu primeiro assistente para começar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-700">
                    <th className="pb-4 font-medium">Perfil</th>
                    <th className="pb-4 font-medium">Nome</th>
                    <th className="pb-4 font-medium">Telefone</th>
                    <th className="pb-4 font-medium">Status da Conexão</th>
                    <th className="pb-4 font-medium">Status do Assistente</th>
                      <th className="pb-4 font-medium">Base de Conhecimento</th>
                    <th className="pb-4 font-medium text-right">Gerenciar</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBots.map((bot) => (
                    <tr key={bot.uid} className="border-b border-gray-700/50">
                      <td className="py-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700">
                          <img
                            src={bot.bot_perfil || DEFAULT_PROFILE_IMAGE}
                            alt={bot.bot_nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-4 text-white">
                        {getBotNameWithoutExtension(bot.bot_nome)}
                      </td>
                      <td className="py-4 text-white">{bot.bot_numero || '-'}</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          {bot.bot_status === 'open' ? (
                            <>
                              <Wifi size={18} className="text-emerald-400" />
                              <span className="text-emerald-400">Online</span>
                            </>
                          ) : (
                            <button
                              onClick={() => handleSyncClick(bot)}
                              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                              <QrCode size={18} />
                              <span>Sincronizar</span>
                            </button>
                          )}
                        </div>
                      </td>
                        <td className="py-4 text-white">
                            {bot.bot_ligado ? 'Ativo' : 'Inativo'}
                        </td>
                        <td className="py-4">
                            <select
                                value={selectedKnowledgeBases[bot.uid] || ''}
                                onChange={(e) => handleKnowledgeBaseChange(bot.uid, e.target.value)}
                                className="bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                {knowledgeBaseOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </td>
                      <td className="py-4 text-right relative">
                        <button
                          onClick={() => handleMenuClick(bot.uid)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <MoreVertical size={20} className="text-gray-400" />
                        </button>
                        {openMenuId === bot.uid && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                              {bot.bot_status === 'open' && (
                                <button
                                  onClick={() => handleActionClick(bot, 'pause')}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-600 w-full text-left"
                                >
                                  <Pause size={16} />
                                  Pausar
                                </button>
                              )}
                              <button
                                onClick={() => handleActionClick(bot, 'delete')}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-600 w-full text-left"
                              >
                                <Trash2 size={16} />
                                Excluir
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="text"
                value={assistantName}
                onChange={(e) => setAssistantName(e.target.value)}
                placeholder="Nome do assistente"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !assistantName}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
                {isLoading ? 'Criando...' : 'Criar'}
              </motion.button>
            </div>
            {successMessage && (
              <p className="mt-2 text-sm text-center text-emerald-400">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="mt-2 text-sm text-center text-red-400">{errorMessage}</p>
            )}
          </form>

          {bots.length > itemsPerPage && (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

        <ConfirmationModal
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal({ isOpen: false })}
            onConfirm={handleConfirmAction}
            title={`${confirmModal.action === 'pause' ? 'Pausar' : 'Excluir'} Assistente`}
            assistantName={confirmModal.botName || ''}
            assistantImage={confirmModal.botImage}
            actionType={confirmModal.action || 'pause'}
        />

      <SyncAssistantModal
          isOpen={syncModal.isOpen}
          onClose={() => setSyncModal({ isOpen: false })}
          assistantName={syncModal.botName || ''}
          assistantImage={syncModal.botImage || ''}
          assistantId={syncModal.botId || ''}
      />
    </div>
  );
};

export default AssistantGrid;