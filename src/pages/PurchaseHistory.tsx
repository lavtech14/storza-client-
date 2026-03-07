import { useState, useEffect } from "react";
import api from "../api/axios";

interface Purchase {
  _id: string;
  supplierName: string;
  totalAmount: number;
  paymentMethod: string;
  purchaseDate: string;
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
      // Adjust this based on your API response structure
      setPurchases(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase History</h1>
        <button
          onClick={() => (window.location.href = "/purchases/new")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          New Purchase
        </button>
      </div>

      {purchases.length === 0 ? (
        <p>No purchases found</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Supplier</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Payment</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id} className="border-t">
                <td className="p-2">{formatDate(purchase.purchaseDate)}</td>
                <td className="p-2">{purchase.supplierName}</td>
                <td className="p-2">₹{purchase.totalAmount}</td>
                <td className="p-2">{purchase.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PurchaseHistory;
