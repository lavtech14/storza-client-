import { useEffect, useState } from "react";
import api from "../api/axios";
import { ProductsContext, type Product } from "./ProductsContext";
import { useAuth } from "./useAuth";

interface Props {
  children: React.ReactNode;
}

export function ProductsProvider({ children }: Props) {
  const { token } = useAuth(); // 👈 get token from auth

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      const data = res.data.data || res.data;

      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshProducts(); // 👈 only run when token exists
    }
  }, [token]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        refreshProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
