import { useEffect, useState } from "react";
import api from "../api/axios";

interface Product {
  _id: string;
  quantity: number;
  minStockAlert?: number;
}

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

function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStock, setLowStock] = useState(0);

  const [totalSales, setTotalSales] = useState(0);
  const [salesRevenue, setSalesRevenue] = useState(0);

  const [totalPurchases, setTotalPurchases] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);

  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [productsRes, salesRes, purchaseRes] = await Promise.all([
        api.get("/products"),
        api.get("/sales"),
        api.get("/purchases"),
      ]);

      const products: Product[] = productsRes.data.data || productsRes.data;
      const sales: Sale[] = salesRes.data.data || salesRes.data;
      const purchases: Purchase[] = purchaseRes.data.data || purchaseRes.data;

      /* PRODUCTS */
      setTotalProducts(products.length);

      const lowStockItems = products.filter(
        (p) => p.quantity <= (p.minStockAlert ?? 5),
      ).length;

      setLowStock(lowStockItems);

      /* SALES */
      setTotalSales(sales.length);

      const revenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);

      setSalesRevenue(revenue);

      setRecentSales(sales.slice(-5).reverse());

      /* PURCHASES */
      setTotalPurchases(purchases.length);

      const purchaseTotal = purchases.reduce(
        (sum, p) => sum + p.totalAmount,
        0,
      );

      setPurchaseAmount(purchaseTotal);

      setRecentPurchases(purchases.slice(-5).reverse());
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Products" value={totalProducts} />
        <StatCard title="Low Stock Items" value={lowStock} />

        <StatCard title="Total Sales" value={totalSales} />
        <StatCard title="Sales Revenue" value={`₹${salesRevenue}`} />

        <StatCard title="Total Purchases" value={totalPurchases} />
        <StatCard title="Purchase Amount" value={`₹${purchaseAmount}`} />
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
            {recentSales.map((sale) => (
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
            {recentPurchases.map((purchase) => (
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
