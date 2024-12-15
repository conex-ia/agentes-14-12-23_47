import React from 'react';
import { Wifi, QrCode, MoreVertical, Pause, Trash2 } from 'lucide-react';
import { Bot } from '../../../types/bot';
import { KnowledgeBase } from '../../../types/knowledgeBase';
import { KnowledgeBaseSelect } from './KnowledgeBaseSelect';
import { DEFAULT_PROFILE_IMAGE } from '../constants';

interface BotTableRowProps {
  bot: Bot;
  bases: KnowledgeBase[];
  selectedKnowledgeBase: string;
  onKnowledgeBaseChange: (value: string) => void;
  onSync: () => void;
  onMenuClick: () => void;
  onAction: (action: 'pause' | 'delete') => void;
  isMenuOpen: boolean;
}

export const BotTableRow: React.FC<BotTableRowProps> = ({
  bot,
  bases,
  selectedKnowledgeBase,
  onKnowledgeBaseChange,
  onSync,
  onMenuClick,
  onAction,
  isMenuOpen
}) => {
  const getBotNameWithoutExtension = (fullName: string) => {
    return fullName.split('.')[0];
  };

  return (
    <tr className="border-b border-gray-700/50">
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
              onClick={onSync}
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
        <KnowledgeBaseSelect
          value={selectedKnowledgeBase}
          onChange={onKnowledgeBaseChange}
          bases={bases}
        />
      </td>
      <td className="py-4 text-right relative">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <MoreVertical size={20} className="text-gray-400" />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {bot.bot_status === 'open' && (
                <button
                  onClick={() => onAction('pause')}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-gray-600 w-full text-left"
                >
                  <Pause size={16} />
                  Pausar
                </button>
              )}
              <button
                onClick={() => onAction('delete')}
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
  );
};