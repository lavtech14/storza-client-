// components/PurchaseBillPrint.tsx
import { forwardRef } from "react";
import type { PurchaseBillData } from "../../types/purchasetype.js";

const PurchaseBillPrint = forwardRef<HTMLDivElement, PurchaseBillData>(
  (
    {
      invoiceNumber,
      supplierName,
      paymentMethod,
      items,
      subtotal,
      gstAmount,
      totalAmount,
      createdAt,
    },
    ref,
  ) => {
    // const formatCurrency = (amount: number) => {
    //   return new Intl.NumberFormat("en-IN", {
    //     style: "currency",
    //     currency: "INR",
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    //   }).format(amount);
    // };

    return (
      <div ref={ref} className="p-8 max-w-4xl mx-auto bg-white">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-center">Purchase Invoice</h1>
          <div className="text-center text-gray-600">GST Invoice</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold">Invoice No:</p>
            <p>{invoiceNumber}</p>
            <p className="font-semibold mt-2">Supplier:</p>
            <p>{supplierName}</p>
          </div>
          <div>
            <p className="font-semibold">Date:</p>
            <p>{new Date(createdAt).toLocaleDateString()}</p>
            <p className="font-semibold mt-2">Payment Method:</p>
            <p className="capitalize">{paymentMethod}</p>
          </div>
        </div>

        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Product</th>
              <th className="border p-2 text-right">Quantity</th>
              <th className="border p-2 text-right">Buy Price</th>
              <th className="border p-2 text-right">GST%</th>
              <th className="border p-2 text-right">Subtotal</th>
              <th className="border p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-2">{item.productId.name}</td>
                <td className="border p-2 text-right">{item.quantity}</td>
                <td className="border p-2 text-right">₹{item.buyPrice}</td>
                <td className="border p-2 text-right">{item.gst}%</td>
                <td className="border p-2 text-right">₹{item.subtotal}</td>
                <td className="border p-2 text-right">₹{item.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan={4} className="border p-2 text-right">
                Subtotal:
              </td>
              <td className="border p-2 text-right">₹{subtotal}</td>
              <td className="border p-2 text-right"></td>
            </tr>
            <tr className="font-semibold">
              <td colSpan={4} className="border p-2 text-right">
                GST Amount:
              </td>
              <td className="border p-2 text-right">₹{gstAmount}</td>
              <td className="border p-2 text-right"></td>
            </tr>
            <tr className="font-semibold">
              <td colSpan={4} className="border p-2 text-right">
                Total:
              </td>
              <td className="border p-2 text-right font-bold">
                ₹{totalAmount}
              </td>
              <td className="border p-2 text-right"></td>
            </tr>
          </tfoot>
        </table>

        <div className="text-center text-sm text-gray-500 mt-8">
          Thank you for your business!
        </div>
      </div>
    );
  },
);

PurchaseBillPrint.displayName = "PurchaseBillPrint";

export default PurchaseBillPrint;
