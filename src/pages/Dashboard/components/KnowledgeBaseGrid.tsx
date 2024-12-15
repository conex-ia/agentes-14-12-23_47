import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Eye, Trash2 } from 'lucide-react';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Pagination from '../../../components/Pagination';
import { KnowledgeBase } from '../../../hooks/useKnowledgeBases';
import { EmptyState } from '../../../components/EmptyState';
import DeleteKnowledgeBaseModal from './DeleteKnowledgeBaseModal';
import ViewKnowledgeBaseModal from './ViewKnowledgeBaseModal';

interface KnowledgeBaseGridProps {
  bases: KnowledgeBase[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

const KnowledgeBaseGrid = ({
  bases,
  currentPage,
  onPageChange
}: KnowledgeBaseGridProps) => {
  const [isDeletingBase, setIsDeletingBase] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    base?: KnowledgeBase;
  }>({ isOpen: false });
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

  const handleOpenDeleteModal = (base: KnowledgeBase) => {
    setDeleteModal({ isOpen: true, base });
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.base?.uid || isDeletingBase) return;

    setIsDeletingBase(deleteModal.base.uid);
    try {
      const response = await fetch('https://webhook.conexcondo.com.br/webhook/cod-gerenciartabela', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          acao: 'excluirTabela',
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

  const formatDate = (dateString: string) => {
    const date = addHours(new Date(dateString), -3);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
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
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-700">
                <th className="p-4 font-medium">Criada</th>
                <th className="p-4 font-medium">Nome</th>
                <th className="p-4 font-medium text-center">Treinamentos</th>
                <th className="p-4 font-medium">Conteúdos</th>
                <th className="p-4 font-medium text-center w-48">Gestão</th>
              </tr>
            </thead>
            <tbody>
              {currentBases.map((base) => (
                <tr key={base.uid} className="border-b border-gray-700/50">
                  <td className="p-4 text-white">
                    {formatDate(base.created_at)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <Database size={20} className="text-emerald-500" />
                      </div>
                      <span className="text-white">{base.nome}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center text-white">
                    {base.treinamentos_qtd || 0}
                  </td>
                  <td className="p-4">
                    <div className="text-gray-300">
                      {base.treinamentos?.map((treinamento, index) => (
                        <div key={index} className="mb-1 last:mb-0">
                          {treinamento}
                        </div>
                      )) || '-'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center">
                        <button 
                          onClick={() => handleOpenViewModal(base)}
                          className="w-12 h-12 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Eye size={24} className="text-emerald-500" />
                        </button>
                        <span className="text-[9px] text-gray-400 mt-1">
                          visualizar
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <button 
                          onClick={() => handleOpenDeleteModal(base)}
                          disabled={isDeletingBase === base.uid}
                          className="w-12 h-12 bg-red-500/10 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={24} className="text-red-500" />
                        </button>
                        <span className="text-[9px] text-gray-400 mt-1">
                          excluir
                        </span>
                      </div>
                    </div>
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