import { createContext } from "react";

export interface Product {
  _id: string;

  name: string;
  category: string;

  sku?: string;
  brand?: string;
  unit?: string;

  buyingPrice?: number;
  sellingPrice?: number;
  discountPrice?: number;

  gst?: number;
  hsnCode?: string;

  barcode?: string;

  quantity: number;
  minStockAlert?: number;

  expiryDate?: string;

  storeId?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsContextType {
  products: Product[];
  loading: boolean;

  page: number;
  limit: number;
  total: number;
  totalPages: number;

  refreshProducts: (
    page?: number,
    limit?: number,
    search?: string,
  ) => Promise<void>;
}

export const ProductsContext = createContext<ProductsContextType>({
  products: [],
  loading: false,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,

  refreshProducts: async () => {},
});
