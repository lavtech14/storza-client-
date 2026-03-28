interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-4 mt-6 justify-center">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 dark:border-slate-700"
      >
        &lt;
      </button>

      <span className="text-sm font-medium">
        {currentPage} / {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 dark:border-slate-700"
      >
        &gt;
      </button>
    </div>
  );
};
