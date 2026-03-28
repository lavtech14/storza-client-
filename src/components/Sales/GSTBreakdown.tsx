// components/SaleForm/GSTBreakdown.tsx

interface GSTBreakdownProps {
  subtotal: number;
  totalGST: number;
  total: number;
  cgst: number;
  sgst: number;
}

export const GSTBreakdown = ({
  subtotal,
  total,
  cgst,
  sgst,
}: GSTBreakdownProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-800/50 rounded-lg">
      <div className="text-center p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
        <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
          Subtotal
        </span>
        <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
          {formatCurrency(subtotal)}
        </div>
      </div>

      <div className="text-center p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
        <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
          CGST (50%)
        </span>
        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(cgst)}
        </div>
      </div>

      <div className="text-center p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
        <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">
          SGST (50%)
        </span>
        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(sgst)}
        </div>
      </div>

      <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg shadow-md border border-indigo-200 dark:border-indigo-800">
        <span className="text-sm text-gray-600 dark:text-gray-300 block mb-1">
          Grand Total
        </span>
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {formatCurrency(total)}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          (Inclusive of GST)
        </div>
      </div>
    </div>
  );
};
