// components/PurchaseForm/PurchaseReportSummary.tsx
import type { PurchaseReport } from "../../types/purchasetype.js";

interface PurchaseReportSummaryProps {
  report: PurchaseReport;
}

export const PurchaseReportSummary = ({
  report,
}: PurchaseReportSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Purchases
              </p>
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
                {formatCurrency(report.summary.totalPurchase)}
              </h3>
            </div>
            <div className="p-3 bg-green-200 dark:bg-green-800 rounded-lg">
              <svg
                className="w-6 h-6 text-green-700 dark:text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total GST
              </p>
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {formatCurrency(report.summary.totalGST)}
              </h3>
            </div>
            <div className="p-3 bg-purple-200 dark:bg-purple-800 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-700 dark:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Orders
              </p>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {formatNumber(report.summary.totalOrders)}
              </h3>
            </div>
            <div className="p-3 bg-blue-200 dark:bg-blue-800 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-700 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {report.chart && report.chart.length > 0 && (
        <div className="mt-6 pt-4 border-t dark:border-slate-700">
          <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Purchase Trend
          </h4>
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
            <div className="space-y-3">
              {report.chart.slice(0, 7).map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-24">
                    {item.date}
                  </span>
                  <div className="flex-1">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300">
                          {formatCurrency(item.total)}
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-200 dark:bg-indigo-900">
                        <div
                          style={{
                            width: `${Math.min(
                              (item.total / report.summary.totalPurchase) * 100,
                              100,
                            )}%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-slate-700">
        <div className="text-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Average Order Value
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {formatCurrency(
              report.summary.totalOrders > 0
                ? report.summary.totalPurchase / report.summary.totalOrders
                : 0,
            )}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Average GST per Order
          </p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {formatCurrency(
              report.summary.totalOrders > 0
                ? report.summary.totalGST / report.summary.totalOrders
                : 0,
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
