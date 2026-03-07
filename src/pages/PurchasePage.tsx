import { useState } from "react";
import api from "../api/axios";
import { useProducts } from "../context/useProducts";

interface Item {
  productId: string;
  quantity: number;
  buyPrice: number;
}

function PurchasePage() {
  const { products } = useProducts();

  const [supplierName, setSupplierName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [items, setItems] = useState<Item[]>([
    { productId: "", quantity: 1, buyPrice: 0 },
  ]);

  const addRow = () => {
    setItems([...items, { productId: "", quantity: 1, buyPrice: 0 }]);
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
    updated[index].buyPrice = product?.buyingPrice ?? 0;

    setItems(updated);
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      return sum + item.quantity * item.buyPrice;
    }, 0);
  };

  const validateForm = () => {
    if (!supplierName.trim()) {
      alert("Please enter supplier name");
      return false;
    }

    if (items.some((item) => !item.productId)) {
      alert("Please select a product for all rows");
      return false;
    }

    if (items.some((item) => item.quantity <= 0)) {
      alert("Quantity must be greater than 0");
      return false;
    }

    if (items.some((item) => item.buyPrice < 0)) {
      alert("Buy price cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        supplierName: supplierName.trim(),
        paymentMethod,
        items,
      };

      await api.post("/purchases", payload);

      alert("Purchase created successfully");

      setSupplierName("");
      setPaymentMethod("cash");
      setItems([{ productId: "", quantity: 1, buyPrice: 0 }]);
    } catch (error) {
      console.error(error);
      alert("Error creating purchase");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      <h1 className="text-2xl font-bold mb-6">Create Purchase</h1>

      {/* Supplier */}
      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium">
          Supplier Name *
        </label>

        <input
          className="border px-3 py-2 rounded-lg w-full max-w-md"
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
          placeholder="Enter supplier name"
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
            <th className="p-3 text-left">Buy Price (₹) *</th>
            <th className="p-3 text-left">Total (₹)</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => (
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

              {/* Buy Price */}
              <td className="p-3">
                <input
                  type="number"
                  min="0"
                  className="border px-3 py-2 rounded-lg w-32"
                  value={item.buyPrice}
                  onChange={(e) =>
                    handleChange(index, "buyPrice", Number(e.target.value))
                  }
                  disabled={isSubmitting}
                />
              </td>

              {/* Row Total */}
              <td className="p-3 font-medium">
                ₹{(item.quantity * item.buyPrice).toFixed(2)}
              </td>

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
          ))}
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

      {/* Total */}
      <div className="mt-6 text-xl font-bold">
        Total Amount: ₹{getTotal().toFixed(2)}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Save Purchase"}
      </button>
    </div>
  );
}

export default PurchasePage;
