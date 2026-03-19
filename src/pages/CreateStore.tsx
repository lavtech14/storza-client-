import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useDebounce from "../hooks/useDebounce";
import { socket } from "../socket";

interface Store {
  _id: string;
  name: string;
  ownerName: string;
  mobile: string;
  email: string;
  address?: string;
  storeType: string;
  isGSTRegistered: boolean;
  gstNumber?: string;
}

function CreateStorePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);
  const [totalPages, setTotalPages] = useState(1);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);

  const [newStore, setNewStore] = useState({
    name: "",
    ownerName: "",
    mobile: "",
    email: "",
    address: "",
    storeType: "other",
    isGSTRegistered: false,
    gstNumber: "",
  });

  const fetchStores = async () => {
    try {
      setLoading(true);

      const res = await api.get("/stores", {
        params: {
          page,
          limit: 10,
          search: debouncedSearch, // 👈 important
        },
      });

      setStores(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching stores", error);
      setStores([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStores();
  }, [page, debouncedSearch]);
  useEffect(() => {
    // ✅ CREATE
    socket.on("storeCreated", (store: Store) => {
      setStores((prev) => [store, ...prev]);
    });

    // ✅ UPDATE
    socket.on("storeUpdated", (updatedStore: Store) => {
      setStores((prev) =>
        prev.map((s) => (s._id === updatedStore._id ? updatedStore : s)),
      );
    });

    // ✅ DELETE
    socket.on("storeDeleted", (id: string) => {
      setStores((prev) => prev.filter((s) => s._id !== id));
    });

    // 🧹 cleanup (VERY IMPORTANT)
    return () => {
      socket.off("storeCreated");
      socket.off("storeUpdated");
      socket.off("storeDeleted");
    };
  }, []);
  const handleSaveStore = async () => {
    try {
      if (
        !newStore.name ||
        !newStore.ownerName ||
        !newStore.mobile ||
        !newStore.email
      ) {
        toast.error("All required fields must be filled");
        return;
      }

      if (newStore.isGSTRegistered && !newStore.gstNumber) {
        toast.error("GST Number required");
        return;
      }

      if (editingStoreId) {
        // UPDATE
        await api.put(`/stores/${editingStoreId}`, newStore);
        toast.success("Store updated successfully ✏️");
      } else {
        // CREATE
        await api.post("/stores", newStore);
        toast.success("Store created successfully 🎉");
      }

      setShowForm(false);
      setEditingStoreId(null);

      setNewStore({
        name: "",
        ownerName: "",
        mobile: "",
        email: "",
        address: "",
        storeType: "other",
        isGSTRegistered: false,
        gstNumber: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error saving store");
    }
  };
  const handleEdit = (store: Store) => {
    setShowForm(true);
    setEditingStoreId(store._id);

    setNewStore({
      name: store.name,
      ownerName: store.ownerName,
      mobile: store.mobile,
      email: store.email,
      address: store.address || "",
      storeType: store.storeType,
      isGSTRegistered: store.isGSTRegistered,
      gstNumber: store.gstNumber || "",
    });
  };
  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this store?")) return;

      await api.delete(`/stores/${id}`);

      toast.success("Store deleted successfully 🗑️");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting store");
    }
  };
  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Stores
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow-sm hover:shadow-md transition"
        >
          {showForm ? "Close Form" : "Create Store"}
        </button>
      </div>

      {/* Form */}

      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">
            Create New Store
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Store Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStore.name}
                onChange={(e) =>
                  setNewStore({ ...newStore, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Owner Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStore.ownerName}
                onChange={(e) =>
                  setNewStore({ ...newStore, ownerName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Mobile<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStore.mobile}
                onChange={(e) =>
                  setNewStore({ ...newStore, mobile: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStore.email}
                onChange={(e) =>
                  setNewStore({ ...newStore, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Store Type<span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStore.storeType}
                onChange={(e) =>
                  setNewStore({ ...newStore, storeType: e.target.value })
                }
              >
                <option value="cloth">Cloth</option>
                <option value="food">Food</option>
                <option value="electrical">Electrical</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={newStore.isGSTRegistered}
                onChange={(e) =>
                  setNewStore({
                    ...newStore,
                    isGSTRegistered: e.target.checked,
                  })
                }
              />
              <label className="text-sm">GST Registered</label>
            </div>

            {newStore.isGSTRegistered && (
              <div>
                <label className="block mb-1 text-sm font-medium">
                  GST Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newStore.gstNumber}
                  onChange={(e) =>
                    setNewStore({ ...newStore, gstNumber: e.target.value })
                  }
                />
              </div>
            )}

            <div className="md:col-span-3">
              <label className="block mb-1 text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newStore.address}
                onChange={(e) =>
                  setNewStore({ ...newStore, address: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={handleSaveStore}
              className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm hover:shadow-md transition"
            >
              Save Store
            </button>
          </div>
        </div>
      )}
      <input
        type="text"
        placeholder="Search stores..."
        className="border rounded-lg px-3 py-2 w-64 mb-4"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      {/* Loading */}

      {loading && (
        <div className="flex justify-center items-center py-10">
          <p className="text-slate-500 animate-pulse">Loading stores...</p>
        </div>
      )}

      {!loading && stores.length === 0 && (
        <div className="flex flex-col items-center py-10 text-center">
          <p className="text-slate-500 text-lg font-medium">No stores found</p>
        </div>
      )}

      {/* Table */}

      {!loading && stores.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="p-3 text-left">Store Name</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">GST</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {stores.map((store) => (
                <tr
                  key={store._id}
                  className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  <td className="p-3">{store.name}</td>
                  <td className="p-3">{store.ownerName}</td>
                  <td className="p-3">{store.mobile}</td>
                  <td className="p-3">{store.email}</td>
                  <td className="p-3 capitalize">{store.storeType}</td>
                  <td className="p-3">{store.address}</td>
                  <td className="p-3">
                    {store.isGSTRegistered ? store.gstNumber : "No"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(store)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(store._id)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-4 mt-6 justify-center">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          &lt;
        </button>

        <span className="text-sm font-medium">
          {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
        >
          &gt;
        </button>
      </div>
      <Link
        to="/"
        className="inline-block mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        ← Back to Home
      </Link>
    </div>
  );
}

export default CreateStorePage;
