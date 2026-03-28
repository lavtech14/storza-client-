import { ReportFilters } from "./ReportFilters.js";
import { ReportSummary } from "./ReportSummary.js";
import { type SalesReport as SalesReportType } from "../../types/saletypes.js";

interface SalesReportProps {
  report: SalesReportType | null;
  reportType: string;
  startDate: string;
  endDate: string;
  onReportTypeChange: (type: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
  onPrint: () => void;
}

export const SalesReport = ({
  report,
  reportType,
  startDate,
  endDate,
  onReportTypeChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
  onPrint,
}: SalesReportProps) => {
  return (
    <div className="mb-6 bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-700">
      <h2 className="text-lg font-semibold mb-4">Sales Report</h2>
      <button
        onClick={onPrint}
        className="px-4 py-2 bg-green-500 text-white rounded-lg mb-4"
      >
        Print Report
      </button>

      <ReportFilters
        reportType={reportType}
        startDate={startDate}
        endDate={endDate}
        onReportTypeChange={onReportTypeChange}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onReset={onReset}
      />

      {report && <ReportSummary report={report} />}
    </div>
  );
};
