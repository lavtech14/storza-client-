import { useEffect, useState } from "react";
import api from "../api/axios";

interface PaymentBreakdown {
  cash: number;
  upi: number;
  card: number;
}

interface Summary {
  totalSales: number;
  totalTax: number;
  todaySales: number;
  paymentBreakdown: PaymentBreakdown;
}

function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get<Summary>("/sales/summary");
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching summary", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 
  bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 
  dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 
  transition-colors duration-500"
    >
      <h1 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">
        Storza Dashboard 🚀
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today Sales */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
          <h2 className="text-sm text-gray-500 dark:text-gray-400">
            Today Sales
          </h2>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">
            ₹{summary.todaySales.toLocaleString()}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
          <h2 className="text-sm text-gray-500 dark:text-gray-400">
            Total Revenue
          </h2>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">
            ₹{summary.totalSales.toLocaleString()}
          </p>
        </div>

        {/* GST Collected */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
          <h2 className="text-sm text-gray-500 dark:text-gray-400">
            GST Collected
          </h2>
          <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-100">
            ₹{summary.totalTax.toLocaleString()}
          </p>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
          <h2 className="text-sm text-gray-500 dark:text-gray-400">
            Payment Breakdown
          </h2>
          <div className="mt-2 space-y-1 text-gray-900 dark:text-gray-100">
            <p>Cash: ₹{summary.paymentBreakdown.cash.toLocaleString()}</p>
            <p>UPI: ₹{summary.paymentBreakdown.upi.toLocaleString()}</p>
            <p>Card: ₹{summary.paymentBreakdown.card.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
