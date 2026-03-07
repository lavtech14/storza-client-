import { useRef, useState } from "react";
import api from "../api/axios";
import { useProducts } from "../context/useProducts";
import BillPrint from "../components/BillPrint.js";
import { useReactToPrint } from "react-to-print";

interface Item {
  productId: string;
  quantity: number;
  price: number;
  gst: number;
}
interface BillItem {
  name: string;
  quantity: number;
  price: number;
  gst: number;
}

interface BillData {
  customerName: string;
  paymentMethod: string;
  items: BillItem[];
  subtotal: number;
  gst: number;
  total: number;
}
function SalesPage() {
  const { products, refreshProducts } = useProducts();
  const printRef = useRef<HTMLDivElement>(null);

  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billData, setBillData] = useState<BillData | null>(null);

  const [items, setItems] = useState<Item[]>([
    { productId: "", quantity: 1, price: 0, gst: 0 },
  ]);

  const addRow = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0, gst: 0 }]);
  };

  const removeRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleChange = <K extends keyof Item>(
    index: number,
    field: K,
    value: Item[K],
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p._id === productId);

    const updated = [...items];
    updated[index].productId = productId;
    updated[index].price = product?.sellingPrice ?? 0;
    updated[index].gst = product?.gst ?? 0;

    setItems(updated);
  };
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });
  const getSubtotal = () => {
    return items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);
  };

  const getGST = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.quantity * item.price;
      return sum + (subtotal * item.gst) / 100;
    }, 0);
  };

  const getTotal = () => {
    return getSubtotal() + getGST();
  };

  const validateForm = () => {
    if (items.some((item) => !item.productId)) {
      alert("Please select a product");
      return false;
    }

    if (items.some((item) => item.quantity <= 0)) {
      alert("Quantity must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const billItems = items.map((item) => {
        const product = products.find((p) => p._id === item.productId);

        return {
          name: product?.name ?? "",
          quantity: item.quantity,
          price: item.price,
          gst: item.gst,
        };
      });

      setBillData({
        customerName,
        paymentMethod,
        items: billItems,
        subtotal: getSubtotal(),
        gst: getGST(),
        total: getTotal(),
      });

      setTimeout(() => {
        handlePrint();
      }, 300);
      const payload = {
        customerName: customerName.trim(),
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      await api.post("/sales", payload);
      await refreshProducts();

      alert("Sale completed");

      setCustomerName("");
      setPaymentMethod("cash");
      setItems([{ productId: "", quantity: 1, price: 0, gst: 0 }]);
    } catch (error) {
      console.error(error);
      alert("Error creating sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      <h1 className="text-2xl font-bold mb-6">Create Sale</h1>

      {/* Customer */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium">Customer Name</label>

        <input
          className="border px-3 py-2 rounded-lg w-full max-w-md"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter customer name"
          disabled={isSubmitting}
        />
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium">Payment Method</label>

        <select
          className="border px-3 py-2 rounded-lg w-full max-w-md"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          disabled={isSubmitting}
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="credit">Credit</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full mb-6 border rounded-lg overflow-hidden">
        <thead className="bg-slate-200 dark:bg-slate-800">
          <tr>
            <th className="p-3 text-left">Product *</th>
            <th className="p-3 text-left">Quantity *</th>
            <th className="p-3 text-left">Price (₹)</th>
            <th className="p-3 text-left">GST %</th>
            <th className="p-3 text-left">Total (₹)</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => {
            const subtotal = item.quantity * item.price;
            const gstAmount = (subtotal * item.gst) / 100;
            const total = subtotal + gstAmount;

            return (
              <tr key={index} className="border-t">
                {/* Product */}
                <td className="p-3">
                  <select
                    className="border px-3 py-2 rounded-lg w-full min-w-[200px]"
                    value={item.productId}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">Select Product</option>

                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Quantity */}
                <td className="p-3">
                  <input
                    type="number"
                    min="1"
                    className="border px-3 py-2 rounded-lg w-24"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", Number(e.target.value))
                    }
                    disabled={isSubmitting}
                  />
                </td>

                {/* Price */}
                <td className="p-3">₹{item.price}</td>

                {/* GST */}
                <td className="p-3">{item.gst}%</td>

                {/* Total */}
                <td className="p-3 font-medium">₹{total.toFixed(2)}</td>

                {/* Remove */}
                <td className="p-3">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeRow(index)}
                      className="text-red-500"
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Row */}
      <button
        onClick={addRow}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg mr-4"
        disabled={isSubmitting}
      >
        + Add Product
      </button>

      {/* Summary */}
      <div className="mt-6 text-lg font-medium">
        Subtotal: ₹{getSubtotal().toFixed(2)}
      </div>

      <div className="text-lg font-medium">GST: ₹{getGST().toFixed(2)}</div>

      <div className="text-xl font-bold">
        Total Amount: ₹{getTotal().toFixed(2)}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
      >
        {isSubmitting ? "Processing..." : "Complete Sale"}
      </button>
      {billData && (
        <div className="hidden">
          <BillPrint
            ref={printRef}
            customerName={billData.customerName}
            paymentMethod={billData.paymentMethod}
            items={billData.items}
            subtotal={billData.subtotal}
            gst={billData.gst}
            total={billData.total}
          />
        </div>
      )}
    </div>
  );
}

export default SalesPage;
