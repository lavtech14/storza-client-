import { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import api from "../api/axios";
import { useProducts } from "../context/useProducts";
import { type Product } from "../context/ProductsContext";
import { socket } from "../socket.js";

function ProductPage() {
  const { products, loading, refreshProducts, totalPages } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

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

  useEffect(() => {
    refreshProducts(page, limit, debouncedSearch);
  }, [page, debouncedSearch]);

  useEffect(() => {
    // ✅ When product is created
    socket.on("productCreated", () => {
      refreshProducts(page, limit, debouncedSearch);
    });

    // ✅ When product is updated
    socket.on("productUpdated", () => {
      refreshProducts(page, limit, debouncedSearch);
    });

    // ✅ When product is deleted
    socket.on("productDeleted", () => {
      refreshProducts(page, limit, debouncedSearch);
    });

    // 🧹 Cleanup (VERY IMPORTANT)
    return () => {
      socket.off("productCreated");
      socket.off("productUpdated");
      socket.off("productDeleted");
    };
  }, [page, debouncedSearch]);
  useEffect(() => {
    socket.on("lowStock", (product) => {
      alert(`⚠️ ${product.name} is low stock`);
    });

    // 🧹 Cleanup (VERY IMPORTANT)
    return () => {
      socket.off("lowStock");
    };
  }, []);
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
      // await refreshProducts(page, limit, debouncedSearch);
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }
  };
  const handleEdit = (product: Product) => {
    setShowForm(true);
    setEditingId(product._id);

    setNewProduct({
      name: product.name || "",
      category: product.category || "general",
      sku: product.sku || "",
      brand: product.brand || "",
      unit: product.unit || "piece",
      buyingPrice: product.buyingPrice?.toString() || "",
      sellingPrice: product.sellingPrice?.toString() || "",
      discountPrice: product.discountPrice?.toString() || "",
      gst: product.gst?.toString() || "0",
      hsnCode: product.hsnCode || "",
      barcode: product.barcode || "",
      quantity: product.quantity?.toString() || "0",
      minStockAlert: product.minStockAlert?.toString() || "5",
      expiryDate: product.expiryDate ? product.expiryDate.substring(0, 10) : "",
    });
  };
  const handleUpdateProduct = async () => {
    try {
      if (!editingId) return;

      const parseNumber = (value: string) =>
        value.trim() === "" ? undefined : Number(value);

      const cleanString = (value: string) =>
        value.trim() === "" ? undefined : value.trim();

      await api.put(`/products/${editingId}`, {
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

      setEditingId(null);
      setNewProduct(initialState);
      setShowForm(false);

      // await refreshProducts(page, limit, debouncedSearch);
    } catch (error) {
      console.error(error);
      alert("Error updating product");
    }
  };
  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?",
      );

      if (!confirmDelete) return;

      await api.delete(`/products/${id}`);

      // await refreshProducts(page, limit, debouncedSearch);
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setNewProduct(initialState);
          }}
          className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          {showForm ? "Close Form" : "Add Product"}
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value.trimStart());
            setPage(1);
          }}
          className="border px-3 py-2 rounded-lg w-80"
        />
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
              onClick={editingId ? handleUpdateProduct : handleCreateProduct}
              className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {editingId ? "Update Product" : "Save Product"}
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!loading && products.length === 0 && (
        <div className="text-center py-10 text-gray-500">No products found</div>
      )}
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
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p: Product) => (
                <tr key={p._id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-medium">{p.name}</td>

                  <td className="p-3">{p.brand || "-"}</td>

                  <td className="p-3">{p.unit}</td>

                  <td className="p-3">₹{p.sellingPrice ?? 0}</td>

                  <td className="p-3">{p.gst ?? 0}%</td>

                  <td className="p-3">{p.quantity}</td>

                  <td className="p-3">
                    {p.quantity <= (p.minStockAlert ?? 5) ? (
                      <span className="text-red-500 font-medium">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600">OK</span>
                    )}
                  </td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center gap-4 mt-6 justify-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          &lt;
        </button>

        <span className="text-sm font-medium">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
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
