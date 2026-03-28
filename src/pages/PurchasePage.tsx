// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import { useProducts } from "../context/useProducts";
// import { socket } from "../socket";
// import useDebounce from "../hooks/useDebounce";

// interface ApiPurchaseItem {
//   _id: string;
//   productId: {
//     _id: string;
//     name: string;
//   } | null;
//   quantity: number;
//   buyPrice: number;
//   subtotal: number;
//   gst: number;
//   gstAmount: number;
//   total: number;
// }
// /* TYPES */
// interface PurchaseItem {
//   productId: string;
//   quantity: number;
//   buyPrice: number;
//   gst: number;
// }

// interface Purchase {
//   _id: string;
//   supplierName: string;
//   paymentMethod: string;
//   items: Array<{
//     _id: string;
//     productId: {
//       _id: string;
//       name: string;
//     } | null; // Make productId nullable
//     quantity: number;
//     buyPrice: number;
//     subtotal: number;
//     gst: number;
//     gstAmount: number;
//     total: number;
//   }>;
//   subtotal: number;
//   gstAmount: number;
//   cgst: number;
//   sgst: number;
//   totalAmount: number;
//   createdAt: string;
// }

// function PurchasePage() {
//   const { products, refreshProducts } = useProducts();

//   /* STATE */
//   const [purchases, setPurchases] = useState<Purchase[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [supplierName, setSupplierName] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("cash");

//   const [items, setItems] = useState<PurchaseItem[]>([
//     { productId: "", quantity: 1, buyPrice: 0, gst: 0 },
//   ]);

//   const [search, setSearch] = useState("");
//   const debouncedSearch = useDebounce(search, 300);

//   const [page, setPage] = useState(1);
//   const limit = 10;
//   const [totalPages, setTotalPages] = useState(1);

//   /* FETCH PURCHASES */
//   const fetchPurchases = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/purchases", {
//         params: {
//           page,
//           limit,
//           search: debouncedSearch,
//         },
//       });

//       setPurchases(res.data.data || []);
//       setTotalPages(res.data.pagination?.totalPages || 1);
//     } catch (err) {
//       console.error("Error fetching purchases:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPurchases();
//   }, [page, debouncedSearch]);

//   /* SOCKET EVENTS */
//   useEffect(() => {
//     socket.on("purchaseCreated", (newPurchase) => {
//       setPurchases((prev) => {
//         const exists = prev.find((p) => p._id === newPurchase._id);
//         if (exists) return prev;
//         return [newPurchase, ...prev];
//       });
//     });

//     socket.on("purchaseUpdated", (updatedPurchase) => {
//       setPurchases((prev) =>
//         prev.map((p) => (p._id === updatedPurchase._id ? updatedPurchase : p)),
//       );
//     });

//     socket.on("purchaseDeleted", (id) => {
//       setPurchases((prev) => prev.filter((p) => p._id !== id));
//     });

//     return () => {
//       socket.off("purchaseCreated");
//       socket.off("purchaseUpdated");
//       socket.off("purchaseDeleted");
//     };
//   }, []);

//   /* ITEM HANDLERS */
//   const handleChange = <K extends keyof PurchaseItem>(
//     index: number,
//     field: K,
//     value: PurchaseItem[K],
//   ) => {
//     const updated = [...items];
//     updated[index][field] = value;
//     setItems(updated);
//   };

//   const handleProductChange = (index: number, productId: string) => {
//     const product = products.find((p) => p._id === productId);
//     const updated = [...items];
//     updated[index].productId = productId;
//     updated[index].buyPrice = product?.buyingPrice ?? 0;
//     updated[index].gst = product?.gst ?? 0;
//     setItems(updated);
//   };

//   const addRow = () => {
//     setItems([...items, { productId: "", quantity: 1, buyPrice: 0, gst: 0 }]);
//   };

//   const removeRow = (index: number) => {
//     if (items.length > 1) {
//       setItems(items.filter((_, i) => i !== index));
//     }
//   };

//   /* CALCULATIONS */
//   const getItemSubtotal = (item: PurchaseItem) => item.quantity * item.buyPrice;
//   const getItemGST = (item: PurchaseItem) =>
//     (item.quantity * item.buyPrice * item.gst) / 100;

//   const getSubtotal = () =>
//     items.reduce((sum, i) => sum + getItemSubtotal(i), 0);
//   const getTotalGST = () => items.reduce((sum, i) => sum + getItemGST(i), 0);
//   const getTotal = () => getSubtotal() + getTotalGST();

//   // Calculate CGST and SGST (assuming GST is split equally)
//   const getCGST = () => getTotalGST() / 2;
//   const getSGST = () => getTotalGST() / 2;

//   /* VALIDATION */
//   const validateForm = () => {
//     if (!supplierName.trim()) {
//       alert("Please enter supplier name");
//       return false;
//     }

//     if (items.some((item) => !item.productId)) {
//       alert("Please select a product for all rows");
//       return false;
//     }

//     if (items.some((item) => item.quantity <= 0)) {
//       alert("Quantity must be greater than 0");
//       return false;
//     }

//     if (items.some((item) => item.buyPrice < 0)) {
//       alert("Buy price cannot be negative");
//       return false;
//     }

//     return true;
//   };

//   /* SUBMIT */
//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     try {
//       setIsSubmitting(true);

//       const payload = {
//         supplierName: supplierName.trim(),
//         paymentMethod,
//         items: items.map((i) => ({
//           productId: i.productId,
//           quantity: i.quantity,
//           buyPrice: i.buyPrice,
//         })),
//       };

//       if (editingId) {
//         await api.put(`/purchases/${editingId}`, payload);
//         alert("Purchase updated successfully");
//       } else {
//         await api.post("/purchases", payload);
//         alert("Purchase created successfully");
//       }

//       await refreshProducts();

//       // Reset form
//       setSupplierName("");
//       setPaymentMethod("cash");
//       setItems([{ productId: "", quantity: 1, buyPrice: 0, gst: 0 }]);
//       setEditingId(null);
//       setShowForm(false);
//     } catch (error) {
//       console.error(error);
//       alert(editingId ? "Error updating purchase" : "Error creating purchase");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   /* EDIT */
//   const handleEdit = (purchase: Purchase) => {
//     setShowForm(true);
//     setEditingId(purchase._id);
//     setSupplierName(purchase.supplierName);
//     setPaymentMethod(purchase.paymentMethod);

//     const mapped: PurchaseItem[] = purchase.items?.map((i) => ({
//       productId: i.productId?._id || "", // Add null check here
//       quantity: i.quantity,
//       buyPrice: i.buyPrice,
//       gst: i.gst,
//     }));

//     setItems(mapped);
//   };

//   /* DELETE */
//   const handleDelete = async (id: string) => {
//     try {
//       const confirmDelete = window.confirm(
//         "Are you sure you want to delete this purchase? This will adjust stock quantities.",
//       );
//       if (!confirmDelete) return;

//       await api.delete(`/purchases/${id}`);
//       alert("Purchase deleted successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Error deleting purchase");
//     }
//   };

//   /* FORMAT CURRENCY */
//   // const formatCurrency = (amount: number) => {
//   //   return new Intl.NumberFormat("en-IN", {
//   //     style: "currency",
//   //     currency: "INR",
//   //     minimumFractionDigits: 2,
//   //   }).format(amount);
//   // };

//   /* HIGHLIGHT SEARCH TEXT */
//   const highlightText = (text: string, search: string) => {
//     if (!search || !text) return text;

//     const parts = text.split(new RegExp(`(${search})`, "gi"));
//     return parts.map((part, i) =>
//       part.toLowerCase() === search.toLowerCase() ? (
//         <span key={i} className="bg-yellow-200 dark:bg-yellow-900 font-medium">
//           {part}
//         </span>
//       ) : (
//         part
//       ),
//     );
//   };

//   // Helper function to get product name safely
//   const getProductName = (item: ApiPurchaseItem) => {
//     if (!item.productId) return "Unknown Product";
//     if (typeof item.productId === "object" && item.productId.name) {
//       return item.productId.name;
//     }
//     return "Unknown Product";
//   };

//   return (
//     <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold">Purchases</h1>
//         <button
//           onClick={() => {
//             setShowForm(!showForm);
//             setEditingId(null);
//             setSupplierName("");
//             setItems([{ productId: "", quantity: 1, buyPrice: 0, gst: 0 }]);
//           }}
//           className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
//         >
//           {showForm ? "Close Form" : "New Purchase"}
//         </button>
//       </div>

//       {/* SEARCH */}
//       <div className="mb-6">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value.trimStart());
//               setPage(1);
//             }}
//             className="border px-3 py-2 rounded-lg w-96 dark:bg-slate-900 dark:border-slate-700 dark:text-white pl-10"
//           />
//           <svg
//             className="absolute left-3 top-3 h-4 w-4 text-gray-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         </div>
//         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//           🔍 Search across supplier names, payment methods, and product names
//         </p>
//       </div>

//       {/* FORM */}
//       {showForm && (
//         <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-8 mb-8">
//           <h2 className="text-xl font-semibold mb-6">
//             {editingId ? "Edit Purchase" : "Create Purchase"}
//           </h2>

//           <div className="grid md:grid-cols-2 gap-5 mb-6">
//             <Input
//               label="Supplier Name *"
//               value={supplierName}
//               onChange={(v) => setSupplierName(v)}
//               placeholder="Enter supplier name"
//               disabled={isSubmitting}
//             />

//             <Select
//               label="Payment Method"
//               value={paymentMethod}
//               options={["cash", "upi", "card", "credit"]}
//               onChange={(v) => setPaymentMethod(v)}
//               disabled={isSubmitting}
//             />
//           </div>

//           {/* ITEMS TABLE */}
//           <div className="mb-6">
//             <label className="block mb-2 text-sm font-medium">Products</label>
//             <div className="border dark:border-slate-700 rounded-xl overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-100 dark:bg-slate-800">
//                   <tr>
//                     <th className="p-3 text-left">Product *</th>
//                     <th className="p-3 text-left">Quantity *</th>
//                     <th className="p-3 text-left">Buy Price (₹)</th>
//                     <th className="p-3 text-left">GST%</th>
//                     <th className="p-3 text-left">Subtotal</th>
//                     <th className="p-3 text-left">GST Amt</th>
//                     <th className="p-3 text-left">Total</th>
//                     <th className="p-3 text-left">Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {items.map((item, i) => {
//                     const subtotal = getItemSubtotal(item);
//                     const gstAmount = getItemGST(item);
//                     const total = subtotal + gstAmount;

//                     return (
//                       <tr
//                         key={i}
//                         className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                       >
//                         <td className="p-3">
//                           <select
//                             value={item.productId}
//                             onChange={(e) =>
//                               handleProductChange(i, e.target.value)
//                             }
//                             className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
//                             disabled={isSubmitting}
//                           >
//                             <option value="">Select Product</option>
//                             {products.map((p) => (
//                               <option key={p._id} value={p._id}>
//                                 {p.name} (Buy: ₹{p.buyingPrice})
//                               </option>
//                             ))}
//                           </select>
//                         </td>

//                         <td className="p-3">
//                           <input
//                             type="number"
//                             min="1"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               handleChange(
//                                 i,
//                                 "quantity",
//                                 Number(e.target.value),
//                               )
//                             }
//                             className="w-20 border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
//                             disabled={isSubmitting}
//                           />
//                         </td>

//                         <td className="p-3">
//                           <input
//                             type="number"
//                             min="0"
//                             step="0.01"
//                             value={item.buyPrice}
//                             onChange={(e) =>
//                               handleChange(
//                                 i,
//                                 "buyPrice",
//                                 Number(e.target.value),
//                               )
//                             }
//                             className="w-24 border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
//                             disabled={isSubmitting}
//                           />
//                         </td>

//                         <td className="p-3">{item.gst}%</td>
//                         <td className="p-3 font-medium">
//                           ₹{subtotal.toFixed(2)}
//                         </td>
//                         <td className="p-3 font-medium">
//                           ₹{gstAmount.toFixed(2)}
//                         </td>
//                         <td className="p-3 font-medium">₹{total.toFixed(2)}</td>

//                         <td className="p-3">
//                           {items.length > 1 && (
//                             <button
//                               onClick={() => removeRow(i)}
//                               className="text-red-600 hover:underline"
//                               disabled={isSubmitting}
//                             >
//                               Remove
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>

//                 {/* Summary Row */}
//                 <tfoot className="bg-slate-50 dark:bg-slate-800 font-semibold">
//                   <tr>
//                     <td colSpan={4} className="p-3 text-right">
//                       Totals:
//                     </td>
//                     <td className="p-3">₹{getSubtotal().toFixed(2)}</td>
//                     <td className="p-3">₹{getTotalGST().toFixed(2)}</td>
//                     <td className="p-3">₹{getTotal().toFixed(2)}</td>
//                     <td className="p-3"></td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>

//             {/* Add Row Button */}
//             <button
//               onClick={addRow}
//               className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
//               disabled={isSubmitting}
//             >
//               + Add Product
//             </button>
//           </div>

//           {/* GST Breakdown */}
//           <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
//             <div className="text-center">
//               <span className="text-sm text-gray-500">Subtotal</span>
//               <div className="text-lg font-bold">
//                 ₹{getSubtotal().toFixed(2)}
//               </div>
//             </div>
//             <div className="text-center">
//               <span className="text-sm text-gray-500">CGST (50%)</span>
//               <div className="text-lg font-bold">₹{getCGST().toFixed(2)}</div>
//             </div>
//             <div className="text-center">
//               <span className="text-sm text-gray-500">SGST (50%)</span>
//               <div className="text-lg font-bold">₹{getSGST().toFixed(2)}</div>
//             </div>
//             <div className="text-center col-span-3 border-t pt-2 mt-2">
//               <span className="text-sm text-gray-500">Grand Total</span>
//               <div className="text-2xl font-bold text-indigo-600">
//                 ₹{getTotal().toFixed(2)}
//               </div>
//             </div>
//           </div>

//           <div className="text-right">
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50 transition-colors"
//             >
//               {isSubmitting
//                 ? editingId
//                   ? "Updating..."
//                   : "Creating..."
//                 : editingId
//                   ? "Update Purchase"
//                   : "Complete Purchase"}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* PURCHASES TABLE */}
//       {loading && (
//         <div className="text-center py-10">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
//           <p className="mt-2 text-gray-500">Loading purchases...</p>
//         </div>
//       )}

//       {!loading && purchases.length === 0 && (
//         <div className="text-center py-10 text-gray-500 dark:text-gray-400">
//           {search ? (
//             <>
//               No purchases found matching "{search}"
//               <button
//                 onClick={() => setSearch("")}
//                 className="ml-2 text-indigo-500 hover:underline"
//               >
//                 Clear search
//               </button>
//             </>
//           ) : (
//             "No purchases found"
//           )}
//         </div>
//       )}

//       {!loading && purchases.length > 0 && (
//         <>
//           {search && (
//             <div className="mb-4 text-sm text-gray-500">
//               Found {purchases.length} result{purchases.length !== 1 ? "s" : ""}{" "}
//               for "{search}"
//             </div>
//           )}

//           <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead className="bg-slate-100 dark:bg-slate-800">
//                 <tr>
//                   <th className="p-3 text-left">Supplier</th>
//                   <th className="p-3 text-left">Products</th>
//                   <th className="p-3 text-left">Payment</th>
//                   <th className="p-3 text-left">Subtotal</th>
//                   <th className="p-3 text-left">GST</th>
//                   <th className="p-3 text-left">Total</th>
//                   <th className="p-3 text-left">Date</th>
//                   <th className="p-3 text-left">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {purchases.map((p) => (
//                   <tr
//                     key={p._id}
//                     className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
//                   >
//                     <td className="p-3 font-medium">
//                       {search
//                         ? highlightText(p.supplierName, search)
//                         : p.supplierName}
//                     </td>
//                     <td className="p-3">
//                       <div className="space-y-1">
//                         {p.items?.map((item, idx) => {
//                           const productName = getProductName(item);
//                           return (
//                             <div key={item._id} className="text-sm">
//                               <span className="font-medium">
//                                 {search
//                                   ? highlightText(productName, search)
//                                   : productName}
//                               </span>
//                               <span className="text-gray-500 dark:text-gray-400">
//                                 {" "}
//                                 × {item.quantity} (₹{item.buyPrice})
//                               </span>
//                               {idx < p.items.length - 1 && <br />}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </td>
//                     <td className="p-3 capitalize">{p.paymentMethod}</td>
//                     <td className="p-3">₹{p.subtotal.toFixed(2)}</td>
//                     <td className="p-3">₹{p.gstAmount.toFixed(2)}</td>
//                     <td className="p-3 font-medium">
//                       ₹{p.totalAmount.toFixed(2)}
//                     </td>
//                     <td className="p-3">
//                       {new Date(p.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="p-3">
//                       <div className="flex gap-3">
//                         <button
//                           onClick={() => handleEdit(p)}
//                           className="text-blue-600 hover:underline"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(p._id)}
//                           className="text-red-600 hover:underline"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* PAGINATION */}
//           {totalPages > 1 && (
//             <div className="flex items-center gap-4 mt-6 justify-center">
//               <button
//                 disabled={page === 1}
//                 onClick={() => setPage((p) => p - 1)}
//                 className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 dark:border-slate-700 transition-colors"
//               >
//                 &lt;
//               </button>

//               <span className="text-sm font-medium">
//                 {page} / {totalPages}
//               </span>

//               <button
//                 disabled={page === totalPages}
//                 onClick={() => setPage((p) => p + 1)}
//                 className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 dark:border-slate-700 transition-colors"
//               >
//                 &gt;
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// /* Reusable Components */
// function Input({
//   label,
//   value,
//   onChange,
//   type = "text",
//   placeholder = "",
//   disabled = false,
// }: {
//   label: string;
//   value: string;
//   type?: string;
//   placeholder?: string;
//   onChange: (value: string) => void;
//   disabled?: boolean;
// }) {
//   return (
//     <div>
//       <label className="block mb-1 text-sm font-medium">{label}</label>
//       <input
//         type={type}
//         placeholder={placeholder}
//         className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         disabled={disabled}
//       />
//     </div>
//   );
// }

// function Select({
//   label,
//   value,
//   options,
//   onChange,
//   disabled = false,
// }: {
//   label: string;
//   value: string;
//   options: string[];
//   onChange: (value: string) => void;
//   disabled?: boolean;
// }) {
//   return (
//     <div>
//       <label className="block mb-1 text-sm font-medium">{label}</label>
//       <select
//         className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white capitalize disabled:opacity-50 disabled:cursor-not-allowed"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         disabled={disabled}
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt} className="capitalize">
//             {opt}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// export default PurchasePage;
// pages/Purchases.tsx
// Purchases.tsx// Purchases.tsx
import { useState, useRef, useEffect } from "react";
import { usePurchases } from "../hooks/usePurchases";
import { useProducts } from "../context/useProducts";
import { PurchaseForm } from "../components/Purchases/PurchaseForm.js";
import { PurchaseHeader } from "../components/Purchases/PurchaseHeader.js";
import { PurchaseSearch } from "../components/Purchases/PurchaseSearch.js";
import { PurchaseTable } from "../components/Purchases/PurchaseTable.js";
import { PurchaseReport } from "../components/Purchases/PurchaseReport.js";
import type {
  PurchaseItem,
  Purchase,
  PurchaseBillData,
  CreatePurchaseRequest,
  UpdatePurchaseRequest,
} from "../types/purchasetype.js";
import type { Product } from "../context/ProductsContext";

const Purchases = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [billData, setBillData] = useState<PurchaseBillData | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const { products } = useProducts();

  const {
    purchases,
    loading,
    report,
    fetchPurchases,
    createPurchase,
    updatePurchase,
    deletePurchase,
    fetchReport,
  } = usePurchases();

  // ✅ REPORT controls everything (chart + summary + table)
  useEffect(() => {
    fetchReport(reportType, startDate, endDate);
  }, [reportType, startDate, endDate]);

  // ✅ SEARCH only updates table
  useEffect(() => {
    fetchPurchases(search);
  }, [search]);

  // ================== CALCULATIONS ==================
  const calculateTotals = () => {
    let subtotal = 0;
    let totalGST = 0;

    items.forEach((item) => {
      const itemSubtotal = item.quantity * item.buyPrice;
      const itemGST = (itemSubtotal * (item.gst || 0)) / 100;
      subtotal += itemSubtotal;
      totalGST += itemGST;
    });

    const cgst = totalGST / 2;
    const sgst = totalGST / 2;
    const total = subtotal + totalGST;

    return { subtotal, totalGST, total, cgst, sgst };
  };

  const { subtotal, totalGST, total, cgst, sgst } = calculateTotals();

  // ================== BILL ==================
  const generateBillData = (): PurchaseBillData => {
    return {
      invoiceNumber: `PO-${Date.now()}`,
      supplierName,
      paymentMethod,
      items: items.map((item) => {
        const product = products.find(
          (p: Product) =>
            p._id ===
            (typeof item.productId === "string"
              ? item.productId
              : item.productId?._id),
        );
        return {
          productId: {
            _id:
              typeof item.productId === "string"
                ? item.productId
                : item.productId?._id || "",
            name: product?.name || "Unknown Product",
          },
          quantity: item.quantity,
          buyPrice: item.buyPrice,
          gst: item.gst,
          subtotal: item.quantity * item.buyPrice,
          total:
            item.quantity * item.buyPrice +
            (item.quantity * item.buyPrice * item.gst) / 100,
        };
      }),
      subtotal,
      gstAmount: totalGST,
      totalAmount: total,
      createdAt: new Date().toISOString(),
    };
  };

  // ================== HANDLERS ==================
  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p: Product) => p._id === productId);
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId,
      buyPrice: product?.buyingPrice || 0,
      gst: product?.gst || 0,
    };
    setItems(newItems);
  };

  const handleItemChange = (
    index: number,
    field: keyof PurchaseItem,
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddProduct = () => {
    setItems([...items, { productId: "", quantity: 1, buyPrice: 0, gst: 0 }]);
  };

  // ================== SUBMIT ==================
  const handleSubmit = async () => {
    if (!supplierName.trim()) {
      alert("Supplier name is required");
      return;
    }

    if (items.length === 0) {
      alert("At least one product is required");
      return;
    }

    const invalidItems = items.some(
      (item) => !item.productId || item.quantity <= 0 || item.buyPrice <= 0,
    );

    if (invalidItems) {
      alert("Please fill all product details correctly");
      return;
    }

    const payload: CreatePurchaseRequest | UpdatePurchaseRequest = {
      supplierName,
      paymentMethod,
      items: items.map((item) => ({
        productId:
          typeof item.productId === "string"
            ? item.productId
            : item.productId?._id || "",
        quantity: item.quantity,
        buyPrice: item.buyPrice,
      })),
    };

    try {
      if (editingId) {
        await updatePurchase(editingId, payload);
        alert("Purchase updated successfully");
      } else {
        await createPurchase(payload);
        alert("Purchase created successfully");
      }

      setBillData(generateBillData());

      // Reset form
      setShowForm(false);
      setEditingId(null);
      setSupplierName("");
      setPaymentMethod("cash");
      setItems([]);

      // ✅ ONLY THIS (refresh everything)
      await fetchReport(reportType, startDate, endDate);
    } catch (error) {
      console.error("Error saving purchase:", error);
      alert("Failed to save purchase");
    }
  };

  // ================== EDIT ==================
  const handleEdit = (purchase: Purchase) => {
    setEditingId(purchase._id);
    setSupplierName(purchase.supplierName);
    setPaymentMethod(purchase.paymentMethod);
    setItems(
      purchase.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        buyPrice: item.buyPrice,
        gst: item.gst || 0,
      })),
    );
    setShowForm(true);
    setBillData(null);
  };

  // ================== DELETE ==================
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deletePurchase(id);
        alert("Deleted successfully");

        // ✅ ONLY THIS
        await fetchReport(reportType, startDate, endDate);
      } catch (error) {
        console.error(error);
        alert("Delete failed");
      }
    }
  };

  const handlePrint = () => window.print();

  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setReportType("daily");
  };

  // ================== UI ==================
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Purchases</h1>
      <PurchaseReport
        report={report}
        reportType={reportType}
        startDate={startDate}
        endDate={endDate}
        onReportTypeChange={setReportType}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onReset={handleResetFilters}
        onPrint={handlePrint}
      />

      <PurchaseSearch search={search} onSearchChange={setSearch} />

      <PurchaseTable
        purchases={purchases}
        loading={loading}
        search={search}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClearSearch={() => setSearch("")}
      />
      <PurchaseHeader
        showForm={showForm}
        onToggleForm={() => setShowForm(!showForm)}
      />

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-6">
            <PurchaseForm
              editingId={editingId}
              supplierName={supplierName}
              paymentMethod={paymentMethod}
              items={items}
              subtotal={subtotal}
              totalGST={totalGST}
              total={total}
              cgst={cgst}
              sgst={sgst}
              billData={billData}
              onSupplierNameChange={setSupplierName}
              onPaymentMethodChange={setPaymentMethod}
              onProductChange={handleProductChange}
              onItemChange={handleItemChange}
              onRemoveRow={handleRemoveRow}
              onSubmit={handleSubmit}
              printRef={printRef}
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Purchases;
