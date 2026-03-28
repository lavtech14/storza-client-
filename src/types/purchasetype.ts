// types/purchasetypes.ts
import type { Product } from "../context/ProductsContext";
export interface PurchaseItem {
  _id?: string;
  productId: string | Product;
  quantity: number;
  buyPrice: number;
  gst: number;
  subtotal?: number;
  gstAmount?: number;
  cgst?: number;
  sgst?: number;
  total?: number;
}

export interface Purchase {
  _id: string;
  invoiceNumber?: string;
  supplierName: string;
  paymentMethod: string;
  storeId?: string;
  items: Array<{
    _id: string;
    productId: Product;
    quantity: number;
    buyPrice: number;
    subtotal: number;
    gst: number;
    gstAmount: number;
    cgst?: number;
    sgst?: number;
    total: number;
  }>;
  subtotal: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface PurchaseBillData {
  invoiceNumber: string;
  supplierName: string;
  paymentMethod: string;
  items: Array<{
    productId: {
      _id: string;
      name: string;
    };
    quantity: number;
    buyPrice: number;
    gst: number;
    subtotal: number;
    total: number;
  }>;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  createdAt: string;
}

export interface PurchaseReportSummary {
  totalPurchase: number;
  totalGST: number;
  totalOrders: number;
}

export interface PurchaseReportChartItem {
  date: string;
  total: number;
}

export interface PurchaseReport {
  summary: PurchaseReportSummary;
  chart: PurchaseReportChartItem[];
  purchases?: Purchase[];
}

// API Request Types
export interface CreatePurchaseRequest {
  supplierName: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    quantity: number;
    buyPrice: number;
  }>;
}

export interface UpdatePurchaseRequest {
  supplierName: string;
  paymentMethod: string;
  items: Array<{
    productId: string;
    quantity: number;
    buyPrice: number;
  }>;
}

export interface PurchaseFilters {
  search?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
}

export interface PurchasePagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PurchaseListResponse {
  success: boolean;
  data: Purchase[];
  pagination: PurchasePagination;
}

export interface PurchaseResponse {
  success: boolean;
  data: Purchase;
  message?: string;
}

export interface PurchaseReportResponse {
  success: boolean;
  data: PurchaseReport;
}
