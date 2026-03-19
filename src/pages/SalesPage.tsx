import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useProducts } from "../context/useProducts";
import { socket } from "../socket";
import BillPrint from "../components/BillPrint";
import { useReactToPrint } from "react-to-print";
import useDebounce from "../hooks/useDebounce";

/* TYPES */
interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  gst: number;
}

interface Sale {
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

interface BillItem {
  name: string;
  quantity: number;
  price: number;
  gst: number;
  subtotal: number;
  gstAmount: number;
  total: number;
}

interface BillData {
  customerName: string;
  paymentMethod: string;
  items: BillItem[];
  subtotal: number;
  gst: number; // This matches BillPrint's expected prop
  cgst: number;
  sgst: number;
  total: number;
}

function SalesPage() {
  const { products } = useProducts();
  const printRef = useRef<HTMLDivElement>(null);

  /* STATE */
  const [sales, setSales] = useState<Sale[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [items, setItems] = useState<SaleItem[]>([
    { productId: "", quantity: 1, price: 0, gst: 0 },
  ]);

  const [billData, setBillData] = useState<BillData | null>(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  /* PRINT */
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  /* FETCH SALES */
  // useEffect(() => {
  //   const fetchSales = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await api.get("/sales", {
  //         params: {
  //           page,
  //           limit,
  //           search: debouncedSearch,
  //         },
  //       });
  //       setSales(res.data.data || []);
  //       setTotalPages(res.data.pagination?.totalPages || 1);
  //     } catch (err) {
  //       console.error("Error fetching sales:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSales();
  // }, [page, debouncedSearch]);
  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await api.get("/sales", {
        params: {
          page,
          limit,
          search: debouncedSearch,
        },
      });

      setSales(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Error fetching sales:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSales();
  }, [page, debouncedSearch]);
  /* SOCKET EVENTS */
  useEffect(() => {
    socket.on("saleCreated", fetchSales);
    socket.on("saleUpdated", fetchSales);
    socket.on("saleDeleted", fetchSales);

    return () => {
      socket.off("saleCreated", fetchSales);
      socket.off("saleUpdated", fetchSales);
      socket.off("saleDeleted", fetchSales);
    };
  }, [page, debouncedSearch]);

  /* ITEM HANDLERS */
  const handleChange = <K extends keyof SaleItem>(
    index: number,
    field: K,
    value: SaleItem[K],
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p._id === productId);
    const updated = [...items];
    updated[index].productId = productId;
    updated[index].price = product?.sellingPrice ?? 0;
    updated[index].gst = product?.gst ?? 0;
    setItems(updated);
  };

  // const addRow = () => {
  //   setItems([...items, { productId: "", quantity: 1, price: 0, gst: 0 }]);
  // };

  const removeRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  /* CALCULATIONS */
  const getItemSubtotal = (item: SaleItem) => item.quantity * item.price;
  const getItemGST = (item: SaleItem) =>
    (item.quantity * item.price * item.gst) / 100;
  // const getItemTotal = (item: SaleItem) =>
  //   getItemSubtotal(item) + getItemGST(item);

  const getSubtotal = () =>
    items.reduce((sum, i) => sum + getItemSubtotal(i), 0);
  const getTotalGST = () => items.reduce((sum, i) => sum + getItemGST(i), 0);
  const getTotal = () => getSubtotal() + getTotalGST();

  // Calculate CGST and SGST (assuming GST is split equally)
  const getCGST = () => getTotalGST() / 2;
  const getSGST = () => getTotalGST() / 2;

  /* SUBMIT */
  const handleSubmit = async () => {
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

      const billItems: BillItem[] = items.map((i) => {
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

      // Reset form
      setCustomerName("");
      setItems([{ productId: "", quantity: 1, price: 0, gst: 0 }]);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error saving sale");
    }
  };

  /* EDIT */
  const handleEdit = (sale: Sale) => {
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

  /* DELETE */
  const handleDelete = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this sale?",
      );
      if (!confirmDelete) return;
      await api.delete(`/sales/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error deleting sale");
    }
  };

  // Highlight matching text in search results
  const highlightText = (text: string, search: string) => {
    if (!search || !text) return text;

    const parts = text.split(new RegExp(`(${search})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-900 font-medium">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Sales</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setCustomerName("");
            setItems([{ productId: "", quantity: 1, price: 0, gst: 0 }]);
          }}
          className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          {showForm ? "Close Form" : "New Sale"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value.trimStart());
              setPage(1);
            }}
            className="border px-3 py-2 rounded-lg w-96 dark:bg-slate-900 dark:border-slate-700 dark:text-white pl-10"
          />
          <svg
            className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          🔍 Search across customer names, invoice numbers, and product names
        </p>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {editingId ? "Edit Sale" : "Create Sale"}
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <Input
              label="Customer Name"
              value={customerName}
              onChange={(v) => setCustomerName(v)}
              placeholder="Enter customer name"
            />

            <Select
              label="Payment Method"
              value={paymentMethod}
              options={["cash", "upi", "card", "credit"]}
              onChange={(v) => setPaymentMethod(v)}
            />
          </div>

          {/* ITEMS TABLE */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Products</label>
            <div className="border dark:border-slate-700 rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">Quantity</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">GST%</th>
                    <th className="p-3 text-left">Subtotal</th>
                    <th className="p-3 text-left">GST Amt</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, i) => {
                    const subtotal = getItemSubtotal(item);
                    const gstAmount = getItemGST(item);
                    const total = subtotal + gstAmount;

                    return (
                      <tr
                        key={i}
                        className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="p-3">
                          <select
                            value={item.productId}
                            onChange={(e) =>
                              handleProductChange(i, e.target.value)
                            }
                            className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
                          >
                            <option value="">Select Product</option>
                            {products.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name} (₹{p.sellingPrice})
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleChange(
                                i,
                                "quantity",
                                Number(e.target.value),
                              )
                            }
                            className="w-20 border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
                          />
                        </td>

                        <td className="p-3 font-medium">₹{item.price}</td>
                        <td className="p-3">{item.gst}%</td>
                        <td className="p-3 font-medium">
                          ₹{subtotal.toFixed(2)}
                        </td>
                        <td className="p-3 font-medium">
                          ₹{gstAmount.toFixed(2)}
                        </td>
                        <td className="p-3 font-medium">₹{total.toFixed(2)}</td>

                        <td className="p-3">
                          {items.length > 1 && (
                            <button
                              onClick={() => removeRow(i)}
                              className="text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Summary Row */}
                <tfoot className="bg-slate-50 dark:bg-slate-800 font-semibold">
                  <tr>
                    <td colSpan={4} className="p-3 text-right">
                      Totals:
                    </td>
                    <td className="p-3">₹{getSubtotal().toFixed(2)}</td>
                    <td className="p-3">₹{getTotalGST().toFixed(2)}</td>
                    <td className="p-3">₹{getTotal().toFixed(2)}</td>
                    <td className="p-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* GST Breakdown */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <div className="text-center">
              <span className="text-sm text-gray-500">Subtotal</span>
              <div className="text-lg font-bold">
                ₹{getSubtotal().toFixed(2)}
              </div>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">CGST (50%)</span>
              <div className="text-lg font-bold">₹{getCGST().toFixed(2)}</div>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">SGST (50%)</span>
              <div className="text-lg font-bold">₹{getSGST().toFixed(2)}</div>
            </div>
            <div className="text-center col-span-3 border-t pt-2 mt-2">
              <span className="text-sm text-gray-500">Grand Total</span>
              <div className="text-2xl font-bold text-indigo-600">
                ₹{getTotal().toFixed(2)}
              </div>
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {editingId ? "Update Sale" : "Complete Sale"}
            </button>
          </div>
        </div>
      )}

      {/* SALES TABLE */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-500">Loading sales...</p>
        </div>
      )}

      {!loading && sales.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          {search ? (
            <>
              No sales found matching "{search}"
              <button
                onClick={() => setSearch("")}
                className="ml-2 text-indigo-500 hover:underline"
              >
                Clear search
              </button>
            </>
          ) : (
            "No sales found"
          )}
        </div>
      )}

      {!loading && sales.length > 0 && (
        <>
          {search && (
            <div className="mb-4 text-sm text-gray-500">
              Found {sales.length} result{sales.length !== 1 ? "s" : ""} for "
              {search}"
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  <th className="p-3 text-left">Invoice #</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Products</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Subtotal</th>
                  <th className="p-3 text-left">GST</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sales.map((s) => (
                  <tr
                    key={s._id}
                    className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="p-3 font-mono text-sm">
                      {search
                        ? highlightText(s.invoiceNumber, search)
                        : s.invoiceNumber}
                    </td>
                    <td className="p-3 font-medium">
                      {search
                        ? highlightText(s.customerName, search)
                        : s.customerName}
                    </td>
                    <td className="p-3">
                      <div className="space-y-1">
                        {s.items.map((item, idx) => (
                          <div key={item._id} className="text-sm">
                            <span className="font-medium">
                              {search
                                ? highlightText(item.productId.name, search)
                                : item.productId.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {" "}
                              × {item.quantity} (₹{item.price})
                            </span>
                            {idx < s.items.length - 1 && <br />}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 capitalize">{s.paymentMethod}</td>
                    <td className="p-3">₹{s.subtotal}</td>
                    <td className="p-3">₹{s.gstAmount}</td>
                    <td className="p-3 font-medium">₹{s.totalAmount}</td>
                    <td className="p-3">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => handleEdit(s)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center gap-4 mt-6 justify-center">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 dark:border-slate-700"
              >
                &lt;
              </button>

              <span className="text-sm font-medium">
                {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 dark:border-slate-700"
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}

      {/* PRINT */}
      {billData && (
        <div className="hidden">
          <BillPrint ref={printRef} {...billData} />
        </div>
      )}
    </div>
  );
}

/* Reusable Components */
function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <select
        className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 dark:bg-slate-900 dark:text-white capitalize"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="capitalize">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SalesPage;
