import { useState, useEffect } from "react";
import api from "../api/axios";
import { socket } from "../socket";
import { type Sale } from "../types/saletypes.js";

export const useSales = (
  page: number,
  search: string,
  filterType: string,
  startDate: string,
  endDate: string,
) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await api.get("/sales", {
          params: {
            page,
            limit: 10,
            search,
            type: filterType,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
          },
        });
        setSales(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (err) {
        console.error("Error fetching sales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [page, search, filterType, startDate, endDate]);

  // Socket events
  useEffect(() => {
    socket.on("saleCreated", (newSale) => {
      setSales((prev) => {
        const exists = prev.find((s) => s._id === newSale._id);
        if (exists) return prev;
        return [newSale, ...prev];
      });
    });

    socket.on("saleUpdated", (updatedSale) => {
      setSales((prev) =>
        prev.map((s) => (s._id === updatedSale._id ? updatedSale : s)),
      );
    });

    socket.on("saleDeleted", (id) => {
      setSales((prev) => prev.filter((s) => s._id !== id));
    });

    return () => {
      socket.off("saleCreated");
      socket.off("saleUpdated");
      socket.off("saleDeleted");
    };
  }, []);

  const deleteSale = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this sale?",
      );
      if (!confirmDelete) return;
      await api.delete(`/sales/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error deleting sale");
    }
  };

  return { sales, loading, totalPages, deleteSale };
};
