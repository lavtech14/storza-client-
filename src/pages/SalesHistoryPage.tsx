import { useEffect, useState } from "react";
import api from "../api/axios";

interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

interface Sale {
  _id: string;
  createdAt: string;
  grandTotal: number;
  paymentMode: string;
  items: SaleItem[];
}

function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSales = async () => {
      try {
        const res = await api.get("/sales");
        if (isMounted) {
          setSales(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchSales();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales History</h1>

      <div className="space-y-4">
        {sales.map((sale) => (
          <div
            key={sale._id}
            className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-4 rounded-xl shadow-sm"
          >
            <div
              className="flex justify-between cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === sale._id ? null : sale._id)
              }
            >
              <div>
                <p className="font-semibold">
                  {new Date(sale.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Payment: {sale.paymentMode}
                </p>
              </div>

              <div className="text-lg font-bold">₹{sale.grandTotal}</div>
            </div>

            {expandedId === sale._id && (
              <div className="mt-4 border-t pt-4 space-y-2">
                {sale.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      Qty: {item.quantity} × ₹{item.price}
                    </span>
                    <span>₹{item.total}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesHistoryPage;
