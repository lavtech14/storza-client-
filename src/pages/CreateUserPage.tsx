import { useEffect, useState } from "react";
import api from "../api/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  storeId?: {
    _id: string;
    name: string;
  };
}

interface Store {
  _id: string;
  name: string;
}

function CreateUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    storeId: "",
  });

  /* ---------------- FETCH USERS ---------------- */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/auth");

      const data = res.data.data || res.data;

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH STORES ---------------- */

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores");
      const data = res.data.data || res.data;
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStores();
  }, []);

  /* ---------------- CREATE USER ---------------- */

  const handleCreateUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        alert("Name, Email and Password required");
        return;
      }

      await api.post("/auth/register", newUser);

      setShowForm(false);

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "staff",
        storeId: "",
      });

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Error creating user");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Users
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white"
        >
          {showForm ? "Close Form" : "Create User"}
        </button>
      </div>

      {/* CREATE USER FORM */}

      {showForm && (
        <div className="bg-white dark:bg-slate-900 border rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Create New User</h2>

          <div className="grid md:grid-cols-3 gap-5">
            <Input
              label="Name"
              value={newUser.name}
              onChange={(v) => setNewUser({ ...newUser, name: v })}
            />

            <Input
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(v) => setNewUser({ ...newUser, email: v })}
            />

            <Input
              label="Password"
              type="password"
              value={newUser.password}
              onChange={(v) => setNewUser({ ...newUser, password: v })}
            />

            {/* ROLE */}

            <div>
              <label className="block mb-1 text-sm font-medium">Role</label>

              <select
                className="w-full border rounded-lg px-3 py-2"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="staff">Staff</option>
                <option value="storeOwner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* STORE */}

            <div>
              <label className="block mb-1 text-sm font-medium">Store</label>

              <select
                className="w-full border rounded-lg px-3 py-2"
                value={newUser.storeId}
                onChange={(e) =>
                  setNewUser({ ...newUser, storeId: e.target.value })
                }
              >
                <option value="">Select Store</option>

                {stores.map((store) => (
                  <option key={store._id} value={store._id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={handleCreateUser}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
            >
              Save User
            </button>
          </div>
        </div>
      )}

      {/* LOADING */}

      {loading && <p className="text-slate-500">Loading users...</p>}

      {/* EMPTY */}

      {!loading && users.length === 0 && (
        <p className="text-slate-500">No users found</p>
      )}

      {/* USERS TABLE */}

      {!loading && users.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Store</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-slate-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">
                    {user.storeId ? user.storeId.name : "No Store"}
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

/* ---------------- REUSABLE INPUT ---------------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        className="w-full border rounded-lg px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default CreateUserPage;
