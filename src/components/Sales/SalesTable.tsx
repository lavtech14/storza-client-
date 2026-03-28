import { SalesTableHeader } from "./SalesTableHeader.js";
import { SalesTableRow } from "./SalesTableRow.js";
import type { Sale } from "../../types/saletypes.js";

interface SalesTableProps {
  sales: Sale[];
  loading: boolean;
  search: string;
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
  onClearSearch: () => void;
}

export const SalesTable = ({
  sales,
  loading,
  search,
  onEdit,
  onDelete,
  onClearSearch,
}: SalesTableProps) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-500">Loading sales...</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        {search ? (
          <>
            No sales found matching "{search}"
            <button
              onClick={onClearSearch}
              className="ml-2 text-indigo-500 hover:underline"
            >
              Clear search
            </button>
          </>
        ) : (
          "No sales found"
        )}
      </div>
    );
  }

  return (
    <>
      {search && (
        <div className="mb-4 text-sm text-gray-500">
          Found {sales.length} result{sales.length !== 1 ? "s" : ""} for "
          {search}"
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <SalesTableHeader />
          <tbody>
            {sales.map((sale) => (
              <SalesTableRow
                key={sale._id}
                sale={sale}
                search={search}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
