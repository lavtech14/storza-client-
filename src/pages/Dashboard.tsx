import { useEffect, useState } from "react";
import api from "../api/axios";
import SalesChart from "../components/SalesChart";
import {
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

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

// Utility function to format currency with 2 decimal places
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Utility function to format number with commas
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-IN").format(num);
};

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeframe, setTimeframe] = useState("week"); // for chart

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
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Calculate profit margin
  const profitMargin =
    data.salesRevenue > 0
      ? ((data.profit / data.salesRevenue) * 100).toFixed(2)
      : "0.00";

  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchDashboard}
            className="px-4 py-2 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(data.todayRevenue)}
          icon={<CurrencyRupeeIcon className="h-6 w-6 text-green-600" />}
          subtitle={`${data.todaySales} transactions today`}
          trend={data.todayRevenue > 0 ? "+12.5%" : "0%"}
          trendUp={data.todayRevenue > 0}
        />

        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(data.monthlyRevenue)}
          icon={<CalendarIcon className="h-6 w-6 text-blue-600" />}
          subtitle="Current month"
          trend="+8.2%"
          trendUp={true}
        />

        <StatCard
          title="Total Sales"
          value={formatNumber(data.totalSales)}
          icon={<ShoppingBagIcon className="h-6 w-6 text-purple-600" />}
          subtitle={`Revenue: ${formatCurrency(data.salesRevenue)}`}
        />

        <StatCard
          title="Profit"
          value={formatCurrency(data.profit)}
          icon={<ArrowTrendingUpIcon className="h-6 w-6 text-emerald-600" />}
          subtitle={`Margin: ${profitMargin}%`}
          trend={profitMargin}
          trendUp={parseFloat(profitMargin) > 15}
        />
      </div>

      {/* SECONDARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={formatNumber(data.totalProducts)}
          icon={<CubeIcon className="h-6 w-6 text-indigo-600" />}
          subtitle={`Low stock: ${data.lowStock} items`}
          warning={data.lowStock > 0}
        />

        <StatCard
          title="Low Stock Alert"
          value={data.lowStock}
          icon={<ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />}
          subtitle="Items need reorder"
          warning={data.lowStock > 0}
        />

        <StatCard
          title="Total Purchases"
          value={formatNumber(data.totalPurchases)}
          icon={<ShoppingBagIcon className="h-6 w-6 text-orange-600" />}
          subtitle={`Amount: ${formatCurrency(data.purchaseAmount)}`}
        />

        <StatCard
          title="Purchase Amount"
          value={formatCurrency(data.purchaseAmount)}
          icon={<CurrencyRupeeIcon className="h-6 w-6 text-rose-600" />}
          subtitle="Total spent on stock"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Sales Overview</h2>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="border dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-slate-900"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">This year</option>
            </select>
          </div>
          <SalesChart />
        </div>

        <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <QuickActionButton
              label="Create New Sale"
              icon={<CurrencyRupeeIcon className="h-5 w-5" />}
              onClick={() => (window.location.href = "/sales")}
              color="green"
            />
            <QuickActionButton
              label="Add Purchase"
              icon={<ShoppingBagIcon className="h-5 w-5" />}
              onClick={() => (window.location.href = "/purchases")}
              color="blue"
            />
            <QuickActionButton
              label="Add New Product"
              icon={<CubeIcon className="h-5 w-5" />}
              onClick={() => (window.location.href = "/products")}
              color="purple"
            />
            <QuickActionButton
              label="View Reports"
              icon={<ArrowTrendingUpIcon className="h-5 w-5" />}
              onClick={() => (window.location.href = "/reports")}
              color="orange"
            />
          </div>

          {/* Low Stock Alert */}
          {data.lowStock > 0 && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Low Stock Alert
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    {data.lowStock} product{data.lowStock !== 1 ? "s" : ""} need
                    {data.lowStock === 1 ? "s" : ""} to be reordered
                  </p>
                  <button className="mt-2 text-sm text-amber-700 dark:text-amber-300 hover:underline">
                    View Products →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RECENT ACTIVITY TABLES */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Sales</h2>
            <a
              href="/sales"
              className="text-sm text-indigo-600 hover:underline"
            >
              View All →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="p-3 text-left font-medium">Invoice</th>
                  <th className="p-3 text-left font-medium">Customer</th>
                  <th className="p-3 text-left font-medium">Amount</th>
                  <th className="p-3 text-left font-medium">Time</th>
                </tr>
              </thead>

              <tbody>
                {data.recentSales.map((sale) => (
                  <tr
                    key={sale._id}
                    className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3 font-mono text-xs">
                      {sale.invoiceNumber}
                    </td>
                    <td className="p-3">{sale.customerName || "Walk-in"}</td>
                    <td className="p-3 font-medium">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(sale.createdAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.recentSales.length === 0 && (
            <p className="text-center text-gray-500 py-4">No recent sales</p>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Purchases</h2>
            <a
              href="/purchases"
              className="text-sm text-indigo-600 hover:underline"
            >
              View All →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800">
                <tr>
                  <th className="p-3 text-left font-medium">Date</th>
                  <th className="p-3 text-left font-medium">Supplier</th>
                  <th className="p-3 text-left font-medium">Amount</th>
                  <th className="p-3 text-left font-medium">Payment</th>
                </tr>
              </thead>

              <tbody>
                {data.recentPurchases.map((purchase) => (
                  <tr
                    key={purchase._id}
                    className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3">
                      {new Date(purchase.purchaseDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                        },
                      )}
                    </td>
                    <td className="p-3">{purchase.supplierName}</td>
                    <td className="p-3 font-medium">
                      {formatCurrency(purchase.totalAmount)}
                    </td>
                    <td className="p-3 capitalize">{purchase.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.recentPurchases.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No recent purchases
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Enhanced StatCard with icon and trend
function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  trendUp = true,
  warning = false,
}: {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border ${warning ? "border-amber-200 dark:border-amber-800" : "dark:border-slate-700"} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h2 className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">
            {value}
          </h2>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <p
              className={`text-xs mt-2 ${trendUp ? "text-green-600" : "text-red-600"}`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`p-3 rounded-lg ${warning ? "bg-amber-100 dark:bg-amber-900/30" : "bg-gray-100 dark:bg-slate-800"}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({
  label,
  icon,
  onClick,
  color,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: "green" | "blue" | "purple" | "orange";
}) {
  const colorClasses = {
    green: "hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600",
    blue: "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600",
    purple: "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600",
    orange: "hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border dark:border-slate-700 transition-colors ${colorClasses[color]}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default Dashboard;
