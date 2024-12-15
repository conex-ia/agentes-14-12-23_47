import React from 'react';
import { KnowledgeBase } from '../../../types/knowledgeBase';

interface KnowledgeBaseSelectProps {
  value: string;
  onChange: (value: string) => void;
  bases: KnowledgeBase[];
  disabled?: boolean;
}

export const KnowledgeBaseSelect: React.FC<KnowledgeBaseSelectProps> = ({
  value,
  onChange,
  bases,
  disabled = false
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
    >
      <option value="">Escolha uma base</option>
      {bases.map((base) => (
        <option key={base.uid} value={base.uid}>
          {base.nome}
        </option>
      ))}
    </select>
  );
};