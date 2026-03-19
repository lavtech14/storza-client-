import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { socket } from "../socket";

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
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedStore, setSelectedStore] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

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

      const res = await api.get("/auth", {
        params: {
          page,
          limit: 10,
          search: debouncedSearch,
          storeId: selectedStore,
        },
      });

      setUsers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users", error);
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
  }, [page, debouncedSearch, selectedStore]);

  useEffect(() => {
    fetchStores();
  }, []);
  useEffect(() => {
    socket.on("userCreated", (user) => {
      setUsers((prev) => [user, ...prev]);
    });

    socket.on("userUpdated", (updatedUser) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)),
      );
    });

    socket.on("userDeleted", (id) => {
      setUsers((prev) => prev.filter((u) => u._id !== id));
    });

    return () => {
      socket.off("userCreated");
      socket.off("userUpdated");
      socket.off("userDeleted");
    };
  }, []);
  /* ---------------- CREATE USER ---------------- */

  const handleSaveUser = async () => {
    try {
      if (!newUser.name || !newUser.email) {
        toast.error("Name and Email are required");
        return;
      }

      if (!editingUserId && !newUser.password) {
        toast.error("Password is required");
        return;
      }

      if (editingUserId) {
        // UPDATE
        await api.put(`/auth/users/${editingUserId}`, newUser);
        toast.success("User updated ✏️");
      } else {
        // CREATE
        await api.post("/auth/register", newUser);
        toast.success("User created 🎉");
      }

      setShowForm(false);
      setEditingUserId(null);

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "staff",
        storeId: "",
      });
    } catch (error) {
      console.error("Error saving user", error);
      toast.error("Error saving user");
    }
  };

  const handleEdit = (user: User) => {
    setShowForm(true);
    setEditingUserId(user._id);

    setNewUser({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      storeId: user.storeId?._id || "",
    });
  };
  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Delete this user?")) return;

      await api.delete(`/auth/users/${id}`);
      toast.success("User deleted 🗑️");
    } catch (error) {
      console.error("Error deleting user", error);
      toast.error("Error deleting user");
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
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border rounded-lg px-3 py-2 w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={selectedStore}
          onChange={(e) => {
            setSelectedStore(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Stores</option>

          {stores.map((store) => (
            <option key={store._id} value={store._id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>
      {/* CREATE USER FORM */}

      {showForm && (
        <div className="bg-white dark:bg-slate-900 border rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">
            {editingUserId ? "Edit User" : "Create New User"}
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            <Input
              label="Name"
              required
              value={newUser.name}
              onChange={(v) => setNewUser({ ...newUser, name: v })}
            />

            <Input
              label="Email"
              type="email"
              required
              value={newUser.email}
              onChange={(v) => setNewUser({ ...newUser, email: v })}
            />

            <Input
              label="Password"
              type="password"
              required
              value={newUser.password}
              onChange={(v) => setNewUser({ ...newUser, password: v })}
            />

            {/* ROLE */}

            <div>
              <label className="block mb-1 text-sm font-medium">
                Role<span className="text-red-500">*</span>
              </label>

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
              <label className="block mb-1 text-sm font-medium">
                Store<span className="text-red-500">*</span>
              </label>

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
              onClick={handleSaveUser}
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
                <th className="p-3 text-left">Actions</th>
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
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
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

/* ---------------- REUSABLE INPUT ---------------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
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
