import { useState, useEffect } from "react";
import api from "../api/axios";
import useDebounce from "../hooks/useDebounce";
import { socket } from "../socket.js";
import { useNavigate } from "react-router-dom";

interface SaleItem {
  productId: {
    name: string;
  };
  quantity: number;
}

interface Sale {
  _id: string;
  invoiceNumber: string;
  customerName?: string;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  items?: SaleItem[];
}

function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const navigate = useNavigate();

  /* RESET PAGE ON SEARCH */
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  /* FETCH SALES */
  useEffect(() => {
    fetchSales();
  }, [page, debouncedSearch]);

  const fetchSales = async () => {
    try {
      setLoading(true);

      const response = await api.get("/sales", {
        params: { page, limit, search: debouncedSearch },
      });

      setSales(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  /* SOCKET EVENTS */
  useEffect(() => {
    socket.on("saleCreated", () => fetchSales());
    socket.on("saleUpdated", () => fetchSales());

    socket.on("saleDeleted", ({ saleId }) => {
      setSales((prev) => prev.filter((s) => s._id !== saleId));
    });

    return () => {
      socket.off("saleCreated");
      socket.off("saleUpdated");
      socket.off("saleDeleted");
    };
  }, []);

  /* NAVIGATION HANDLERS */
  const handleView = (id: string) => {
    navigate(`/sales/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/sales/edit/${id}`);
  };

  /* DELETE */
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this sale?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/sales/${id}`);

      // Optimistic update
      setSales((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales History</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />

          <button
            onClick={() => navigate("/sales")}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
          >
            New Sale
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}

        {sales.length === 0 ? (
          <p className="p-6 text-center">No sales found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-200 dark:bg-slate-800">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Invoice</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Products</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3">GST</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id} className="border-t">
                  <td className="p-3">{formatDate(sale.createdAt)}</td>

                  <td className="p-3 font-medium">{sale.invoiceNumber}</td>

                  <td className="p-3">
                    {sale.customerName || "Walk-in Customer"}
                  </td>

                  <td className="p-3">
                    {sale.items?.map((item, index) => (
                      <div key={index}>
                        {item.productId?.name} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="p-3">₹{sale.subtotal?.toFixed(2)}</td>
                  <td className="p-3">₹{sale.gstAmount?.toFixed(2)}</td>

                  <td className="p-3 font-semibold">
                    ₹{sale.totalAmount?.toFixed(2)}
                  </td>

                  <td className="p-3 capitalize">{sale.paymentMethod}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleView(sale._id)}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleEdit(sale._id)}
                      className="text-yellow-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(sale._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center gap-4 mt-6 justify-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &lt;
        </button>

        <span className="text-sm font-medium">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default SalesHistory;
