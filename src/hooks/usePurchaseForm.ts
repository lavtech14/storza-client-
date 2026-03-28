import { useState } from "react";
import api from "../api/axios";
import { useProducts } from "../context/useProducts";
import type { Purchase, PurchaseItem } from "../types/purchasetype";

export const usePurchaseForm = (
  onSuccess?: () => void,
  refreshProducts?: () => Promise<void>,
) => {
  const { products } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [items, setItems] = useState<PurchaseItem[]>([
    { productId: "", quantity: 1, buyPrice: 0, gst: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getItemSubtotal = (item: PurchaseItem) => item.quantity * item.buyPrice;
  const getItemGST = (item: PurchaseItem) =>
    (item.quantity * item.buyPrice * item.gst) / 100;
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
    updated[index].buyPrice = product?.buyingPrice ?? 0;
    updated[index].gst = product?.gst ?? 0;
    setItems(updated);
  };

  const handleChange = <K extends keyof PurchaseItem>(
    index: number,
    field: K,
    value: PurchaseItem[K],
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { productId: "", quantity: 1, buyPrice: 0, gst: 0 }]);
  };

  const removeRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setSupplierName("");
    setPaymentMethod("cash");
    setItems([{ productId: "", quantity: 1, buyPrice: 0, gst: 0 }]);
    setEditingId(null);
    setShowForm(false);
  };

  const validateForm = () => {
    if (!supplierName.trim()) {
      alert("Please enter supplier name");
      return false;
    }

    if (items.some((item) => !item.productId)) {
      alert("Please select a product for all rows");
      return false;
    }

    if (items.some((item) => item.quantity <= 0)) {
      alert("Quantity must be greater than 0");
      return false;
    }

    if (items.some((item) => item.buyPrice < 0)) {
      alert("Buy price cannot be negative");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        supplierName: supplierName.trim(),
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          buyPrice: i.buyPrice,
        })),
      };

      if (editingId) {
        await api.put(`/purchases/${editingId}`, payload);
        alert("Purchase updated successfully");
      } else {
        await api.post("/purchases", payload);
        alert("Purchase created successfully");
      }

      if (refreshProducts) {
        await refreshProducts();
      }

      resetForm();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert(editingId ? "Error updating purchase" : "Error creating purchase");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editPurchase = (purchase: Purchase) => {
    setShowForm(true);
    setEditingId(purchase._id);
    setSupplierName(purchase.supplierName);
    setPaymentMethod(purchase.paymentMethod);

    const mapped: PurchaseItem[] = purchase.items?.map((i) => ({
      productId: i.productId?._id || "",
      quantity: i.quantity,
      buyPrice: i.buyPrice,
      gst: i.gst,
    }));

    setItems(mapped);
  };

  return {
    // State
    showForm,
    editingId,
    supplierName,
    paymentMethod,
    items,
    isSubmitting,
    // Computed
    subtotal: getSubtotal(),
    totalGST: getTotalGST(),
    total: getTotal(),
    cgst: getCGST(),
    sgst: getSGST(),
    // Actions
    setShowForm,
    setSupplierName,
    setPaymentMethod,
    handleProductChange,
    handleChange,
    addRow,
    removeRow,
    handleSubmit,
    editPurchase,
    resetForm,
  };
};
