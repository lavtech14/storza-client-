// components/PurchaseForm/PurchaseReport.tsx
import { PurchaseReportFilters } from "./PurchaseReportFilters.js";
import { PurchaseReportSummary } from "./PurchaseReportSummary.js";
import { type PurchaseReport as PurchaseReportType } from "../../types/purchasetype.js";

interface PurchaseReportProps {
  report: PurchaseReportType | null;
  reportType: string;
  startDate: string;
  endDate: string;
  onReportTypeChange: (type: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
  onPrint: () => void;
}

export const PurchaseReport = ({
  report,
  reportType,
  startDate,
  endDate,
  onReportTypeChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
  onPrint,
}: PurchaseReportProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Purchase Report</h2>
        <button
          onClick={onPrint}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Print Report
        </button>
      </div>

      <PurchaseReportFilters
        reportType={reportType}
        startDate={startDate}
        endDate={endDate}
        onReportTypeChange={onReportTypeChange}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onReset={onReset}
      />

      {/* Show active filter info */}
      {(startDate || endDate) && (
        <div className="mt-3 text-sm text-blue-600 dark:text-blue-400">
          📅 Showing purchases from {startDate || "start"} to{" "}
          {endDate || "today"}
        </div>
      )}

      {!startDate && !endDate && reportType && (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          📊 Showing {reportType} report:{" "}
          {reportType === "daily"
            ? "Today"
            : reportType === "weekly"
              ? "Last 7 days"
              : reportType === "monthly"
                ? "This month"
                : "This year"}{" "}
          purchases
        </div>
      )}

      {report && <PurchaseReportSummary report={report} />}
    </div>
  );
};
