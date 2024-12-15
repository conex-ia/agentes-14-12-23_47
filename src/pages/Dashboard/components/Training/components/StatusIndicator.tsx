import React from 'react';
import { phaseIcons, phaseMessages } from '../constants';

interface StatusIndicatorProps {
  phase: string;
}

export const StatusIndicator = ({ phase }: StatusIndicatorProps) => {
  const Icon = phaseIcons[phase as keyof typeof phaseIcons] || phaseIcons.aguardando;
  const message = phaseMessages[phase as keyof typeof phaseMessages] || phaseMessages.aguardando;
  const isError = phase.includes('erro');

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-12 rounded-lg bg-gray-700/50 flex items-center justify-center">
        <Icon 
          size={24} 
          className={isError ? 'text-red-500' : 'text-emerald-500'} 
        />
      </div>
      <span className={`text-[9px] ${isError ? 'text-red-400' : 'text-gray-400'}`}>
        {message}
      </span>
    </div>
  );
};