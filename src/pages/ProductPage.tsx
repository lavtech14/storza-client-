import { useState } from "react";
import api from "../api/axios";
import { useProducts } from "../context/useProducts";

function ProductPage() {
  const { products, loading, refreshProducts } = useProducts();
  const [showForm, setShowForm] = useState(false);

  const initialState = {
    name: "",
    category: "general",
    sku: "",
    brand: "",
    unit: "piece",
    buyingPrice: "",
    sellingPrice: "",
    discountPrice: "",
    gst: "0",
    hsnCode: "",
    barcode: "",
    quantity: "0",
    minStockAlert: "5",
    expiryDate: "",
  };

  const [newProduct, setNewProduct] = useState(initialState);

  const handleChange = (field: string, value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateProduct = async () => {
    try {
      if (!newProduct.name.trim()) {
        alert("Product name is required");
        return;
      }
      const parseNumber = (value: string) =>
        value.trim() === "" ? undefined : Number(value);

      const cleanString = (value: string) =>
        value.trim() === "" ? undefined : value.trim();

      await api.post("/products", {
        name: newProduct.name.trim(),
        category: newProduct.category,

        sku: cleanString(newProduct.sku),
        brand: cleanString(newProduct.brand),
        unit: newProduct.unit,

        buyingPrice: parseNumber(newProduct.buyingPrice),
        sellingPrice: parseNumber(newProduct.sellingPrice),
        discountPrice: parseNumber(newProduct.discountPrice),

        gst: parseNumber(newProduct.gst),
        hsnCode: cleanString(newProduct.hsnCode),

        barcode: cleanString(newProduct.barcode),

        quantity: parseNumber(newProduct.quantity) ?? 0,
        minStockAlert: parseNumber(newProduct.minStockAlert) ?? 5,

        expiryDate: newProduct.expiryDate
          ? new Date(newProduct.expiryDate)
          : undefined,
      });

      setShowForm(false);
      setNewProduct(initialState);
      await refreshProducts();
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          {showForm ? "Close Form" : "Add Product"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 border rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Create Product</h2>

          <div className="grid md:grid-cols-3 gap-5">
            <Input
              label="Product Name"
              value={newProduct.name}
              onChange={(v) => handleChange("name", v)}
            />

            <Input
              label="Category"
              value={newProduct.category}
              onChange={(v) => handleChange("category", v)}
            />

            <Input
              label="Brand"
              value={newProduct.brand}
              onChange={(v) => handleChange("brand", v)}
            />

            <Input
              label="SKU"
              value={newProduct.sku}
              onChange={(v) => handleChange("sku", v)}
            />

            <Select
              label="Unit"
              value={newProduct.unit}
              options={["kg", "gram", "litre", "ml", "piece", "packet", "box"]}
              onChange={(v) => handleChange("unit", v)}
            />

            <Select
              label="GST (%)"
              value={newProduct.gst}
              options={["0", "5", "12", "18", "28"]}
              onChange={(v) => handleChange("gst", v)}
            />

            <Input
              label="Buying Price"
              type="number"
              value={newProduct.buyingPrice}
              onChange={(v) => handleChange("buyingPrice", v)}
            />

            <Input
              label="Selling Price"
              type="number"
              value={newProduct.sellingPrice}
              onChange={(v) => handleChange("sellingPrice", v)}
            />

            <Input
              label="Discount Price"
              type="number"
              value={newProduct.discountPrice}
              onChange={(v) => handleChange("discountPrice", v)}
            />

            <Input
              label="Quantity"
              type="number"
              value={newProduct.quantity}
              onChange={(v) => handleChange("quantity", v)}
            />

            <Input
              label="Min Stock Alert"
              type="number"
              value={newProduct.minStockAlert}
              onChange={(v) => handleChange("minStockAlert", v)}
            />

            <Input
              label="HSN Code"
              value={newProduct.hsnCode}
              onChange={(v) => handleChange("hsnCode", v)}
            />

            <Input
              label="Barcode"
              value={newProduct.barcode}
              onChange={(v) => handleChange("barcode", v)}
            />

            <Input
              label="Expiry Date"
              type="date"
              value={newProduct.expiryDate}
              onChange={(v) => handleChange("expiryDate", v)}
            />
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={handleCreateProduct}
              className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Save Product
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!loading && products.length > 0 && (
        <div className="bg-white border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Unit</th>
                <th className="p-3 text-left">Selling</th>
                <th className="p-3 text-left">GST</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Min Alert</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.brand}</td>
                  <td className="p-3">{p.unit}</td>
                  <td className="p-3">₹{p.sellingPrice}</td>
                  <td className="p-3">{p.gst}%</td>
                  <td className="p-3">{p.quantity}</td>
                  <td className="p-3">
                    {p.quantity <= (p.minStockAlert ?? 5) ? (
                      <span className="text-red-500 font-medium">
                        Low Stock
                      </span>
                    ) : (
                      "OK"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* Reusable Components */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        className="w-full border rounded-lg px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <select
        className="w-full border rounded-lg px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductPage;
