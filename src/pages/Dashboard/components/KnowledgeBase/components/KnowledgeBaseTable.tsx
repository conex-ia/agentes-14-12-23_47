import React from 'react';
import { Database, Eye, Trash2 } from 'lucide-react';
import { KnowledgeBase } from '../../../../../hooks/useKnowledgeBases';
import { formatDate } from '../utils/dateFormat';

interface KnowledgeBaseTableProps {
  bases: KnowledgeBase[];
  onOpenDeleteModal: (base: KnowledgeBase) => void;
  onOpenViewModal: (base: KnowledgeBase) => void;
  isDeletingBase: string | null;
}

export const KnowledgeBaseTable: React.FC<KnowledgeBaseTableProps> = ({
  bases,
  onOpenDeleteModal,
  onOpenViewModal,
  isDeletingBase
}) => {
  return (
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
          {bases.map((base) => (
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
                      onClick={() => onOpenViewModal(base)}
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
                      onClick={() => onOpenDeleteModal(base)}
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
  );
};