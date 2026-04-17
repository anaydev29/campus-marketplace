import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [prodRes, userRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/products", { headers }),
          fetch("http://localhost:5000/api/admin/users", { headers }),
        ]);

        if (prodRes.status === 403 || userRes.status === 403) {
          setError("Access denied. Admins only.");
          setLoading(false);
          return;
        }

        if (prodRes.ok) setProducts(await prodRes.json());
        if (userRes.ok) setUsers(await userRes.json());
      } catch {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user? This will also remove their listings.")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(users.filter((u) => u._id !== id));
    } catch {
      alert("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-10 h-10 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
          </div>
          <p className="text-gray-500 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="stitch-card-strong rounded-3xl p-12 text-center max-w-sm animate-scale-in">
          <p className="text-5xl mb-4">🚫</p>
          <h2 className="font-heading text-xl font-bold text-gray-100 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto animate-fade-in">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⚙️</span>
            <h1 className="font-heading text-3xl font-bold text-gray-100">Admin Panel</h1>
          </div>
          <p className="text-gray-500 text-sm">Manage all users and product listings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
          <div className="stat-violet rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-violet-400">{products.length}</p>
            <p className="text-gray-400 text-sm mt-1 font-medium">Total Products</p>
          </div>
          <div className="stat-cyan rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-cyan-400">{users.length}</p>
            <p className="text-gray-400 text-sm mt-1 font-medium">Total Users</p>
          </div>
          <div className="stat-emerald rounded-2xl p-6 text-center">
            <p className="text-3xl font-bold text-emerald-400">
              ₹{products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm mt-1 font-medium">Total Listed Value</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === "products"
                ? "stitch-btn"
                : "stitch-btn-ghost"
            }`}
          >
            📦 Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === "users"
                ? "stitch-btn"
                : "stitch-btn-ghost"
            }`}
          >
            👥 Users ({users.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="stitch-card-strong rounded-3xl overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="font-heading text-lg font-semibold text-gray-100">All Products</h2>
            </div>
            {products.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-14">No products found.</p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {products.map((product) => (
                  <div key={product._id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-all duration-300">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-200 truncate">{product.title}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-sm font-bold stitch-gradient-text">₹{product.price.toLocaleString()}</span>
                        <span className="stitch-badge text-xs px-2.5 py-0.5 rounded-full font-medium">{product.category}</span>
                        {product.condition && (
                          <span className="stitch-badge-emerald text-xs px-2.5 py-0.5 rounded-full font-medium">{product.condition}</span>
                        )}
                        {product.seller?.name && (
                          <span className="text-xs text-gray-500">by {product.seller.name}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      disabled={deletingId === product._id}
                      className="ml-4 text-xs font-semibold text-rose-400/60 hover:text-rose-400 disabled:text-rose-400/30 transition cursor-pointer"
                    >
                      {deletingId === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="stitch-card-strong rounded-3xl overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="font-heading text-lg font-semibold text-gray-100">All Users</h2>
            </div>
            {users.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-14">No users found.</p>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {users.map((user) => (
                  <div key={user._id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-all duration-300">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-200 truncate">{user.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-gray-500 truncate">{user.email}</span>
                          {user.role === "admin" && (
                            <span className="stitch-badge text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={deletingId === user._id}
                        className="ml-4 text-xs font-semibold text-rose-400/60 hover:text-rose-400 disabled:text-rose-400/30 transition cursor-pointer"
                      >
                        {deletingId === user._id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;