import { useState, useEffect } from "react";
import api from "../api/axios";

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
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await api.get("/purchases");
      setPurchases(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="p-8">Loading purchases...</div>;
  }

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase History</h1>

        <button
          onClick={() => (window.location.href = "/purchases/new")}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          New Purchase
        </button>
      </div>

      {purchases.length === 0 ? (
        <p>No purchases found</p>
      ) : (
        <div className="bg-white border rounded-xl overflow-x-auto">
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

                  {/* Products */}
                  <td className="p-3">
                    {purchase.items?.map((item, index) => (
                      <div key={index}>
                        {item.productId?.name} × {item.quantity}
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
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;
