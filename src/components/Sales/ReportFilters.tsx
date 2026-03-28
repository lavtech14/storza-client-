// components/SalesReport/ReportFilters.tsx

interface ReportFiltersProps {
  reportType: string;
  startDate: string;
  endDate: string;
  onReportTypeChange: (type: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
}

export const ReportFilters = ({
  reportType,
  startDate,
  endDate,
  onReportTypeChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: ReportFiltersProps) => {
  const reportTypes = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const hasCustomDates = startDate || endDate;

  return (
    <div className="space-y-4">
      {/* Date Range Inputs */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-2 items-end">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Report Type Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2 self-center">
          Report Type:
        </span>
        {reportTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onReportTypeChange(type.value)}
            disabled={!!(hasCustomDates && type.value !== reportType)}
            className={`
              px-4 py-2 rounded-lg capitalize font-medium transition-all
              ${
                reportType === type.value && !hasCustomDates
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-700"
              }
              ${
                hasCustomDates && type.value !== reportType
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
            title={
              hasCustomDates && type.value !== reportType
                ? "Clear custom date range to use preset filters"
                : `View ${type.label} report`
            }
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Info Message when custom dates are active */}
      {hasCustomDates && (
        <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <span className="font-medium">ℹ️ Custom date range active</span>
          <p className="mt-1">
            Showing data from{" "}
            {startDate ? new Date(startDate).toLocaleDateString() : "start"} to{" "}
            {endDate ? new Date(endDate).toLocaleDateString() : "today"}. Click
            "Reset" to use preset filters.
          </p>
        </div>
      )}
    </div>
  );
};
