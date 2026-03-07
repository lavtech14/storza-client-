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
  refreshProducts: () => Promise<void>;
}

export const ProductsContext = createContext<ProductsContextType>({
  products: [],
  loading: false,
  refreshProducts: async () => {},
});
