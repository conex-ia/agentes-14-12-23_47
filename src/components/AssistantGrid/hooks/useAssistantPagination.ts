import { useState, useEffect } from 'react';
import { Bot } from '../../../types/bot';

export function useAssistantPagination(bots: Bot[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((bots?.length || 0) / itemsPerPage);
  
  // Update current page when bots array changes
  useEffect(() => {
    if (currentPage > 1 && bots.length <= (currentPage - 1) * itemsPerPage) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [bots.length, currentPage, itemsPerPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBots = bots?.slice(startIndex, endIndex) || [];

  return {
    currentPage,
    setCurrentPage,
    currentBots,
    totalPages
  };
}