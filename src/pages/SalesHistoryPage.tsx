import { useState, useEffect } from "react";
import api from "../api/axios";

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
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales History</h1>

        <button
          onClick={() => (window.location.href = "/sales/new")}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
        >
          New Sale
        </button>
      </div>

      {sales.length === 0 ? (
        <p>No sales found</p>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden">
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

                {/* Products */}
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
  );
}

export default SalesHistory;
