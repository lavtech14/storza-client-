import { useState } from "react";
import api from "../api/axios";
import { useProducts } from "../context/useProducts";
import { type SaleItem, type BillData, type Sale } from "../types/saletypes.js";

export const useSaleForm = (onSuccess?: () => void) => {
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [items, setItems] = useState<SaleItem[]>([
    { productId: "", quantity: 1, price: 0, gst: 0 },
  ]);
  const [billData, setBillData] = useState<BillData | null>(null);

  const getItemSubtotal = (item: SaleItem) => item.quantity * item.price;
  const getItemGST = (item: SaleItem) =>
    (item.quantity * item.price * item.gst) / 100;
  const getSubtotal = () =>
    items.reduce((sum, i) => sum + getItemSubtotal(i), 0);
  const getTotalGST = () => items.reduce((sum, i) => sum + getItemGST(i), 0);
  const getTotal = () => getSubtotal() + getTotalGST();
  const getCGST = () => getTotalGST() / 2;
  const getSGST = () => getTotalGST() / 2;

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p._id === productId);
    const updated = [...items];
    updated[index].productId = productId;
    updated[index].price = product?.sellingPrice ?? 0;
    updated[index].gst = product?.gst ?? 0;
    setItems(updated);
  };

  const handleChange = <K extends keyof SaleItem>(
    index: number,
    field: K,
    value: SaleItem[K],
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const removeRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const addRow = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0, gst: 0 }]);
  };

  const resetForm = () => {
    setCustomerName("");
    setItems([{ productId: "", quantity: 1, price: 0, gst: 0 }]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (handlePrint?: () => void) => {
    try {
      if (!customerName.trim()) {
        alert("Customer name is required");
        return;
      }

      if (items.some((item) => !item.productId)) {
        alert("Please select a product for each row");
        return;
      }

      const payload = {
        customerName: customerName.trim(),
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      if (editingId) {
        await api.put(`/sales/${editingId}`, payload);
      } else {
        await api.post("/sales", payload);
      }

      const billItems = items.map((i) => {
        const p = products.find((x) => x._id === i.productId);
        const subtotal = getItemSubtotal(i);
        const gstAmount = getItemGST(i);

        return {
          name: p?.name ?? "",
          quantity: i.quantity,
          price: i.price,
          gst: i.gst,
          subtotal,
          gstAmount,
          total: subtotal + gstAmount,
        };
      });

      setBillData({
        customerName,
        paymentMethod,
        items: billItems,
        subtotal: getSubtotal(),
        gst: getTotalGST(),
        cgst: getCGST(),
        sgst: getSGST(),
        total: getTotal(),
      });

      setTimeout(() => handlePrint?.(), 300);
      resetForm();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Error saving sale");
    }
  };

  const editSale = (sale: Sale) => {
    setShowForm(true);
    setEditingId(sale._id);
    setCustomerName(sale.customerName);
    setPaymentMethod(sale.paymentMethod);

    const mapped: SaleItem[] = sale.items.map((i) => ({
      productId: i.productId._id,
      quantity: i.quantity,
      price: i.price,
      gst: i.gst,
    }));

    setItems(mapped);
  };

  return {
    // State
    showForm,
    editingId,
    customerName,
    paymentMethod,
    items,
    billData,
    // Computed
    subtotal: getSubtotal(),
    totalGST: getTotalGST(),
    total: getTotal(),
    cgst: getCGST(),
    sgst: getSGST(),
    // Actions
    setShowForm,
    setCustomerName,
    setPaymentMethod,
    handleProductChange,
    handleChange,
    removeRow,
    addRow,
    handleSubmit,
    editSale,
    resetForm,
    setBillData,
  };
};
