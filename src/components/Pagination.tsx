import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 my-6">
      {currentPage > 1 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          <ChevronLeft size={16} />
        </motion.button>
      )}
      
      <span className="text-gray-400">
        {currentPage} de {totalPages}
      </span>

      {currentPage < totalPages && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
        >
          <ChevronRight size={16} />
        </motion.button>
      )}
    </div>
  );
};

export default Pagination;