export interface Product {
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

  storeId: string;
}
