import { useEffect, useState } from "react";
import api from "../api/axios";
import SalesChart from "../components/SalesChart";

interface Sale {
  _id: string;
  invoiceNumber: string;
  customerName?: string;
  totalAmount: number;
  createdAt: string;
}

interface Purchase {
  _id: string;
  supplierName: string;
  totalAmount: number;
  paymentMethod: string;
  purchaseDate: string;
}

interface DashboardData {
  totalProducts: number;
  lowStock: number;

  totalSales: number;
  salesRevenue: number;

  todaySales: number;
  todayRevenue: number;

  monthlyRevenue: number;

  totalPurchases: number;
  purchaseAmount: number;

  profit: number;

  recentSales: Sale[];
  recentPurchases: Purchase[];
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Products" value={data.totalProducts} />
        <StatCard title="Low Stock Items" value={data.lowStock} />

        <StatCard title="Total Sales" value={data.totalSales} />
        <StatCard title="Sales Revenue" value={`₹${data.salesRevenue}`} />

        <StatCard title="Today's Sales" value={data.todaySales} />
        <StatCard title="Today's Revenue" value={`₹${data.todayRevenue}`} />

        <StatCard title="Monthly Revenue" value={`₹${data.monthlyRevenue}`} />

        <StatCard title="Profit" value={`₹${data.profit}`} />

        <StatCard title="Total Purchases" value={data.totalPurchases} />
        <StatCard title="Purchase Amount" value={`₹${data.purchaseAmount}`} />
      </div>

      {/* RECENT SALES */}
      <div className="bg-white border rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Invoice</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {data.recentSales.map((sale) => (
              <tr key={sale._id} className="border-t">
                <td className="p-2">{sale.invoiceNumber}</td>
                <td className="p-2">{sale.customerName || "Walk-in"}</td>
                <td className="p-2">₹{sale.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RECENT PURCHASES */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Purchases</h2>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Supplier</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Payment</th>
            </tr>
          </thead>

          <tbody>
            {data.recentPurchases.map((purchase) => (
              <tr key={purchase._id} className="border-t">
                <td className="p-2">
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </td>
                <td className="p-2">{purchase.supplierName}</td>
                <td className="p-2">₹{purchase.totalAmount}</td>
                <td className="p-2">{purchase.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SalesChart />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
}

export default Dashboard;
