import { useEffect, useState } from "react";
import api from "../api/axios";

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
      const res = await api.get("/stores");
      setStores(res.data);
    } catch (error) {
      console.error("Error fetching stores", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCreateStore = async () => {
    try {
      if (
        !newStore.name ||
        !newStore.ownerName ||
        !newStore.mobile ||
        !newStore.email
      ) {
        alert("All required fields must be filled");
        return;
      }

      if (newStore.isGSTRegistered && !newStore.gstNumber) {
        alert("GST Number required");
        return;
      }

      await api.post("/stores", newStore);

      setShowForm(false);

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

      fetchStores();
    } catch (error) {
      console.error(error);
      alert("Error creating store");
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
                Store Name
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
                Owner Name
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
              <label className="block mb-1 text-sm font-medium">Mobile</label>
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
              <label className="block mb-1 text-sm font-medium">Email</label>
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
                Store Type
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
                  GST Number
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
              <label className="block mb-1 text-sm font-medium">Address</label>
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
              onClick={handleCreateStore}
              className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm hover:shadow-md transition"
            >
              Save Store
            </button>
          </div>
        </div>
      )}

      {/* Loading */}

      {loading && (
        <p className="text-slate-500 dark:text-slate-400">Loading stores...</p>
      )}

      {/* Empty state */}

      {!loading && stores.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400">No stores found</p>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CreateStorePage;
