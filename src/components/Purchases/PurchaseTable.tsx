// components/PurchaseForm/PurchaseTable.tsx
import { PurchaseTableHeader } from "./PurchaseTableHeader.js";
import { PurchaseTableRow } from "./PurchaseTableRow.js";
import type { Purchase } from "../../types/purchasetype.js";

interface PurchaseTableProps {
  purchases: Purchase[] | undefined;
  loading: boolean;
  search: string;
  onEdit: (purchase: Purchase) => void;
  onDelete: (id: string) => void;
  onClearSearch: () => void;
}

export const PurchaseTable = ({
  purchases = [],
  loading,
  search,
  onEdit,
  onDelete,
  onClearSearch,
}: PurchaseTableProps) => {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-500">Loading purchases...</p>
      </div>
    );
  }

  // Ensure purchases is an array and has items
  const purchasesArray = Array.isArray(purchases) ? purchases : [];

  if (purchasesArray.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        {search ? (
          <>
            No purchases found matching "{search}"
            <button
              onClick={onClearSearch}
              className="ml-2 text-indigo-500 hover:underline"
            >
              Clear search
            </button>
          </>
        ) : (
          "No purchases found"
        )}
      </div>
    );
  }

  return (
    <>
      {search && (
        <div className="mb-4 text-sm text-gray-500">
          Found {purchasesArray.length} result
          {purchasesArray.length !== 1 ? "s" : ""} for "{search}"
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <PurchaseTableHeader />
          <tbody>
            {purchasesArray.map((purchase) => (
              <PurchaseTableRow
                key={purchase._id}
                purchase={purchase}
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
