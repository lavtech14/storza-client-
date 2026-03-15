import { useEffect, useState } from "react";
import api from "../api/axios";
import { ProductsContext, type Product } from "./ProductsContext";
import { useAuth } from "./useAuth";

interface Props {
  children: React.ReactNode;
}

export function ProductsProvider({ children }: Props) {
  const { token } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const refreshProducts = async (
    pageParam: number = 1,
    limitParam: number = 10,
    search: string = "",
  ) => {
    try {
      setLoading(true);

      const res = await api.get("/products", {
        params: {
          page: pageParam,
          limit: limitParam,
          search,
        },
      });

      const responseData = res.data;

      setProducts(responseData.data || []);
      setTotal(responseData.pagination?.total || 0);
      setTotalPages(responseData.pagination?.totalPages || 1);
      setPage(responseData.pagination?.page || 1);
    } catch (error) {
      console.error("Failed to load products", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshProducts();
    }
  }, [token]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        page,
        limit,
        total,
        totalPages,
        refreshProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
