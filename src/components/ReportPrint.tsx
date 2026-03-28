import { forwardRef } from "react";
import { type SalesReport } from "../types/saletypes.js";

interface ReportPrintProps {
  report: SalesReport | null;
}

const ReportPrint = forwardRef<HTMLDivElement, ReportPrintProps>(
  ({ report }, ref) => {
    if (!report) return null;

    return (
      <div ref={ref} style={{ padding: 20 }}>
        <h2>Sales Report</h2>

        {/* SUMMARY */}
        <p>
          <strong>Total Sales:</strong> ₹{report.summary.totalSales}
        </p>
        <p>
          <strong>Total GST:</strong> ₹{report.summary.totalGST}
        </p>
        <p>
          <strong>Total Orders:</strong> {report.summary.totalOrders}
        </p>

        <hr style={{ margin: "10px 0" }} />

        {/* 🔥 SALES TABLE */}
        <h3>Sales List</h3>

        <table
          border={1}
          cellPadding={8}
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {report.sales?.map((sale) => (
              <tr key={sale._id}>
                <td>{sale.invoiceNumber}</td>
                <td>{sale.customerName}</td>
                <td>₹{sale.totalAmount}</td>
                <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

export default ReportPrint;
