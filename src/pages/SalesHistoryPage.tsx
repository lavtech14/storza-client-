import { useState, useEffect } from "react";
import api from "../api/axios";
import useDebounce from "../hooks/useDebounce";

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

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch]);

  const fetchSales = async () => {
    try {
      setLoading(true);

      const response = await api.get("/sales", {
        params: {
          page,
          limit,
          search: debouncedSearch,
        },
      });

      setSales(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
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
            placeholder="Search customer, invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />

          <button
            onClick={() => (window.location.href = "/sales/new")}
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
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Invoice</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Products</th>
                <th className="p-3 text-left">Subtotal</th>
                <th className="p-3 text-left">GST</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Action</th>
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

                  <td className="p-3">
                    <button
                      onClick={() =>
                        (window.location.href = `/sales/${sale._id}`)
                      }
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default SalesHistory;
