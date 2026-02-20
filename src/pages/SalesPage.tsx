import { useEffect, useState } from "react";
import api from "../api/axios";

interface Product {
  _id: string;
  name: string;
  price: number;
  gstRate: number;
}

interface CartItem extends Product {
  quantity: number;
}

function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMode, setPaymentMode] = useState("cash");

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cart functions
  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const decreaseQuantity = (id: string) => {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // Totals
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalTax = cart.reduce(
    (acc, item) => acc + (item.price * item.quantity * item.gstRate) / 100,
    0,
  );
  const grandTotal = subtotal + totalTax;

  // Complete Sale
  const handleCompleteSale = async () => {
    try {
      const saleData = {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        paymentMode,
      };

      await api.post("/sales", saleData);
      alert("Sale completed successfully!");
      setCart([]);
    } catch (error) {
      console.error("Sale failed", error);
      alert("Sale failed. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-500 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Sales Panel 🚀</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Products */}
        <div className="md:col-span-2 bg-white/30 dark:bg-white/5 backdrop-blur-xl p-4 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Products</h2>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products available</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border border-white/40 dark:border-white/10 p-3 rounded-lg cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition"
                  onClick={() => addToCart(product)}
                >
                  <h3 className="font-semibold">{product.name}</h3>
                  <p>₹{product.price}</p>
                  <p className="text-sm text-gray-500">
                    GST: {product.gstRate}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart */}
        <div className="bg-white/30 dark:bg-white/5 backdrop-blur-xl p-4 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Cart</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b border-white/20 dark:border-white/10 py-2"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} x {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="px-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      onClick={() => addToCart(item)}
                    >
                      +
                    </button>

                    <button
                      className="text-red-500 ml-2 hover:text-red-600 transition"
                      onClick={() => removeFromCart(item._id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="mt-4 border-t border-white/20 dark:border-white/10 pt-4">
                <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
                <p>GST: ₹{totalTax.toFixed(2)}</p>
                <p className="font-bold text-lg">
                  Total: ₹{grandTotal.toFixed(2)}
                </p>
              </div>

              <select
                className="w-full border border-white/30 dark:border-white/20 p-2 mt-4 rounded"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
              </select>

              <button
                onClick={handleCompleteSale}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Complete Sale
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesPage;
