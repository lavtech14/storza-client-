import { useState, useEffect } from "react";
import api from "../api/axios";
import useDebounce from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";

interface PurchaseItem {
  productId: {
    name: string;
  };
  quantity: number;
  buyPrice: number;
}

interface Purchase {
  _id: string;
  supplierName: string;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  items?: PurchaseItem[];
}

function PurchaseHistory() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
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
    fetchPurchases();
  }, [page, debouncedSearch, limit]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);

      const response = await api.get("/purchases", {
        params: {
          page,
          limit,
          search: debouncedSearch,
        },
      });

      setPurchases(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching purchases:", error);
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
        <h1 className="text-2xl font-bold">Purchase History</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search purchases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />

          <button
            onClick={() => navigate("/purchases")}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
          >
            New Purchase
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-x-auto">
        {loading ? (
          <div className="p-6 text-center">Loading purchases...</div>
        ) : purchases.length === 0 ? (
          <div className="p-6 text-center">No purchases found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Products</th>
                <th className="p-3 text-left">Subtotal</th>
                <th className="p-3 text-left">GST</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Payment</th>
              </tr>
            </thead>

            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase._id} className="border-t">
                  <td className="p-3">{formatDate(purchase.createdAt)}</td>

                  <td className="p-3 font-medium">
                    {purchase.supplierName || "-"}
                  </td>

                  <td className="p-3">
                    {purchase.items?.map((item, index) => (
                      <div key={index}>
                        {item.productId?.name ?? "Unknown Product"} ×{" "}
                        {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="p-3">₹{purchase.subtotal?.toFixed(2)}</td>

                  <td className="p-3">₹{purchase.gstAmount?.toFixed(2)}</td>

                  <td className="p-3 font-semibold">
                    ₹{purchase.totalAmount?.toFixed(2)}
                  </td>

                  <td className="p-3 capitalize">{purchase.paymentMethod}</td>
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
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          &lt;
        </button>

        <span className="text-sm font-medium">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default PurchaseHistory;
