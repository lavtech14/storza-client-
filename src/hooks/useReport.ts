import { useState, useEffect } from "react";
import api from "../api/axios";
import { type SalesReport } from "../types/saletypes.js";

export const useReport = () => {
  const [reportType, setReportType] = useState("daily");
  const [report, setReport] = useState<SalesReport | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReport = async (type: string, start?: string, end?: string) => {
    try {
      setLoading(true);
      const res = await api.get("/sales/saleReport", {
        params: {
          type,
          startDate: start || undefined,
          endDate: end || undefined,
        },
      });
      setReport(res.data.data);
    } catch (err) {
      console.error("Report error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(reportType, startDate, endDate);
  }, [reportType, startDate, endDate]);

  const resetReport = () => {
    setStartDate("");
    setEndDate("");
    setReportType("daily");
  };

  return {
    reportType,
    report,
    startDate,
    endDate,
    loading,
    setReportType,
    setStartDate,
    setEndDate,
    resetReport,
    fetchReport,
  };
};
