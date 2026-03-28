import { useState } from "react";
import api from "../api/axios";
import type {
  Purchase,
  PurchaseReport,
  CreatePurchaseRequest,
  UpdatePurchaseRequest,
  PurchaseListResponse,
  PurchaseResponse,
  PurchaseReportResponse,
} from "../types/purchasetype.js";

interface FetchPurchasesParams {
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
}

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<PurchaseReport | null>(null);

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // ✅ GLOBAL FILTER STATE (IMPORTANT)
  const [filters, setFilters] = useState<{
    startDate?: string;
    endDate?: string;
    type?: string;
  }>({});

  // ✅ FETCH PURCHASES (table)
  const fetchPurchases = async (
    search = "",
    page = 1,
    limit = 10,
    customFilters?: {
      startDate?: string;
      endDate?: string;
      type?: string;
    },
  ) => {
    setLoading(true);
    try {
      // Use passed filters OR stored filters
      const appliedFilters = customFilters || filters;

      const params: FetchPurchasesParams = {
        search,
        page,
        limit,
      };

      if (appliedFilters.startDate && appliedFilters.endDate) {
        params.startDate = appliedFilters.startDate;
        params.endDate = appliedFilters.endDate;
      }

      if (
        appliedFilters.type &&
        !appliedFilters.startDate &&
        !appliedFilters.endDate
      ) {
        params.type = appliedFilters.type;
      }

      const response = await api.get<PurchaseListResponse>("/purchases", {
        params,
      });

      setPurchases(response.data.data || []);
      setPagination(response.data.pagination);

      return response.data;
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setPurchases([]);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ REPORT + TABLE SYNC
  const fetchReport = async (
    type?: string,
    startDate?: string,
    endDate?: string,
  ) => {
    setLoading(true);
    try {
      const newFilters = { type, startDate, endDate };
      setFilters(newFilters);

      const response = await api.get<PurchaseReportResponse>(
        "/purchases/report",
        {
          params: newFilters,
        },
      );

      setReport(response.data.data);

      // ✅ Update table with SAME filters
      await fetchPurchases("", 1, 10, newFilters);

      return response.data;
    } catch (error) {
      console.error("Error fetching purchase report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ CREATE
  const createPurchase = async (data: CreatePurchaseRequest) => {
    try {
      const response = await api.post<PurchaseResponse>("/purchases", data);

      // refresh table after create
      await fetchPurchases();

      return response.data;
    } catch (error) {
      console.error("Error creating purchase:", error);
      throw error;
    }
  };

  // ✅ UPDATE
  const updatePurchase = async (id: string, data: UpdatePurchaseRequest) => {
    try {
      const response = await api.put<PurchaseResponse>(
        `/purchases/${id}`,
        data,
      );

      await fetchPurchases();

      return response.data;
    } catch (error) {
      console.error("Error updating purchase:", error);
      throw error;
    }
  };

  // ✅ DELETE
  const deletePurchase = async (id: string) => {
    try {
      const response = await api.delete(`/purchases/${id}`);

      await fetchPurchases();

      return response.data;
    } catch (error) {
      console.error("Error deleting purchase:", error);
      throw error;
    }
  };

  return {
    purchases,
    loading,
    report,
    pagination,
    filters, // optional (if UI needs)
    fetchPurchases,
    fetchReport,
    createPurchase,
    updatePurchase,
    deletePurchase,
  };
};
