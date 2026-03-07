import { useState, useEffect } from "react";
import api from "../api/axios";

interface Sale {
  _id: string;
  invoiceNumber: string;
  customerName?: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get("/sales");
      setSales(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
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
        <h1 className="text-2xl font-bold">Sales History</h1>

        <button
          onClick={() => (window.location.href = "/sales/new")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          New Sale
        </button>
      </div>

      {sales.length === 0 ? (
        <p>No sales found</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Invoice</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Payment</th>
            </tr>
          </thead>

          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id} className="border-t">
                <td className="p-2">{formatDate(sale.createdAt)}</td>
                <td className="p-2">{sale.invoiceNumber}</td>
                <td className="p-2">{sale.customerName || "Walk-in"}</td>
                <td className="p-2">₹{sale.totalAmount}</td>
                <td className="p-2">{sale.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalesHistory;
