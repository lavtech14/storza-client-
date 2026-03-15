import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface SalesData {
  _id: string;
  revenue: number;
}

function SalesChart() {
  const [data, setData] = useState<SalesData[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("/analytics/sales-last-7-days");
        setData(res.data);
      } catch (error) {
        console.error("Sales chart error:", error);
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="bg-white border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Sales (Last 7 Days)</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="_id"
            tickFormatter={(date) =>
              new Date(date).toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
              })
            }
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesChart;
