
import React from 'react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        variant="outline"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={handleNextPage}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
