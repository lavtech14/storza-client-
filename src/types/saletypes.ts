export interface ReportSaleItem {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  totalAmount: number;
  createdAt: string;
}

export interface SalesReport {
  summary: {
    totalSales: number;
    totalGST: number;
    totalOrders: number;
  };
  chart: {
    date: string;
    total: number;
  }[];
  sales?: ReportSaleItem[]; // 🔥 ADD THIS
}
export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  gst: number;
}

export interface Sale {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  paymentMethod: string;
  items: Array<{
    _id: string;
    productId: {
      _id: string;
      name: string;
    };
    quantity: number;
    price: number;
    subtotal: number;
    gst: number;
    gstAmount: number;
    total: number;
  }>;
  subtotal: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  createdAt: string;
}

export interface BillItem {
  name: string;
  quantity: number;
  price: number;
  gst: number;
  subtotal: number;
  gstAmount: number;
  total: number;
}

export interface BillData {
  customerName: string;
  paymentMethod: string;
  items: BillItem[];
  subtotal: number;
  gst: number;
  cgst: number;
  sgst: number;
  total: number;
}

export interface ReportSummary {
  totalSales: number;
  totalGST: number;
  totalOrders: number;
}

export interface ReportChartItem {
  date: string;
  total: number;
}

export interface SalesReport {
  summary: ReportSummary;
  chart: ReportChartItem[];
}
