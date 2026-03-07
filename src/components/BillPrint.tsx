import React, { forwardRef } from "react";

interface Item {
  name: string;
  quantity: number;
  price: number;
  gst: number;
}

interface BillProps {
  customerName: string;
  paymentMethod: string;
  items: Item[];
  subtotal: number;
  gst: number;
  total: number;
}

const BillPrint = forwardRef<HTMLDivElement, BillProps>(
  ({ customerName, paymentMethod, items, subtotal, gst, total }, ref) => {
    return (
      <div ref={ref} className="p-6 w-[300px] text-sm">
        <h2 className="text-lg font-bold text-center">My Store</h2>
        <p className="text-center">Sales Invoice</p>

        <div className="mt-4">
          <p>Customer: {customerName || "Walk-in"}</p>
          <p>Payment: {paymentMethod}</p>
          <p>Date: {new Date().toLocaleString()}</p>
        </div>

        <table className="w-full mt-4 border-t border-b">
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST: ₹{gst.toFixed(2)}</p>
          <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
        </div>

        <p className="text-center mt-4">Thank you!</p>
      </div>
    );
  },
);

export default BillPrint;
