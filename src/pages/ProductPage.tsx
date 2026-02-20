import { useEffect, useState } from "react";
import api from "../api/axios";

interface Product {
  _id: string;
  name: string;
  category: string; // add this
  price: number;
  stock: number;
  gstRate: number;
}

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    gstRate: 0,
    hsnCode: "",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error, "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.category) {
        alert("Name and Category are required");
        return;
      }

      await api.post("/products", newProduct);

      setShowForm(false);

      setNewProduct({
        name: "",
        price: 0,
        stock: 0,
        category: "",
        gstRate: 0,
        hsnCode: "",
      });

      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-500">
      {/* Add Product Button */}
      <button
        className="btn-primary mb-6"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "Add Product"}
      </button>

      {/* Product Form */}
      {showForm && (
        <div className="max-w-4xl mx-auto p-6 rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-2xl mb-8">
          <h2 className="text-xl font-bold mb-6">Add New Product</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Product Name</label>
              <input
                type="text"
                className="input-field"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <input
                type="text"
                className="input-field"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Price</label>
              <input
                type="number"
                className="input-field"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Stock</label>
              <input
                type="number"
                className="input-field"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">GST Rate (%)</label>
              <input
                type="number"
                className="input-field"
                value={newProduct.gstRate}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    gstRate: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">HSN Code</label>
              <input
                type="text"
                className="input-field"
                value={newProduct.hsnCode}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, hsnCode: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-6 text-right">
            <button className="btn-success" onClick={handleCreateProduct}>
              Save Product
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Products
      </h1>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl backdrop-blur-xl bg-white/30 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">GST %</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-white/20 dark:hover:bg-gray-700 transition-all"
                >
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3">{product.gstRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductPage;
