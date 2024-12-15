import React from 'react';
import { Bot } from '../../../types/bot';
import { KnowledgeBase } from '../../../types/knowledgeBase';
import { BotTableRow } from './BotTableRow';
import { Pagination } from '../../Pagination';

interface AssistantTableProps {
  bots: Bot[];
  bases: KnowledgeBase[];
  selectedKnowledgeBases: { [key: string]: string };
  onKnowledgeBaseChange: (botId: string, value: string) => void;
  onSync: (bot: Bot) => void;
  onMenuClick: (botId: string) => void;
  onAction: (bot: Bot, action: 'pause' | 'delete') => void;
  openMenuId: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AssistantTable: React.FC<AssistantTableProps> = ({
  bots,
  bases,
  selectedKnowledgeBases,
  onKnowledgeBaseChange,
  onSync,
  onMenuClick,
  onAction,
  openMenuId,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <>
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
            {bots.map((bot) => (
              <BotTableRow
                key={bot.uid}
                bot={bot}
                bases={bases}
                selectedKnowledgeBase={selectedKnowledgeBases[bot.uid] || ''}
                onKnowledgeBaseChange={(value) => onKnowledgeBaseChange(bot.uid, value)}
                onSync={() => onSync(bot)}
                onMenuClick={() => onMenuClick(bot.uid)}
                onAction={(action) => onAction(bot, action)}
                isMenuOpen={openMenuId === bot.uid}
              />
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
    </>
  );
};