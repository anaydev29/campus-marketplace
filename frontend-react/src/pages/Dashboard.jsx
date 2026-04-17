import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [userRes, prodRes] = await Promise.all([
          fetch("http://localhost:5000/api/auth/me", { headers }),
          fetch("http://localhost:5000/api/products/my", { headers }),
        ]);

        if (userRes.ok) setUser(await userRes.json());
        if (prodRes.ok) setProducts(await prodRes.json());
        else setError("Failed to load your listings.");
      } catch {
        setError("Server error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProducts(products.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleSold = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/products/${id}/sold`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProducts(products.map((p) =>
          p._id === id ? { ...p, isSold: !currentStatus } : p
        ));
      }
    } catch {
      alert("Failed to update. Please try again.");
    } finally {
      setTogglingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-10 h-10 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
          </div>
          <p className="text-gray-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const activeProducts = products.filter((p) => !p.isSold);
  const soldProducts = products.filter((p) => p.isSold);

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-gray-100">My Dashboard</h1>
            {user && (
              <p className="text-gray-500 text-sm mt-1">
                Welcome back, <span className="font-semibold text-violet-400">{user.name}</span> · {user.email}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Link
              to="/sell"
              className="stitch-btn text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300"
            >
              + New Listing
            </Link>
            <button
              onClick={handleLogout}
              className="stitch-btn-ghost text-sm font-medium px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 stagger-children">
          <div className="stat-violet rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-violet-400">{products.length}</p>
            <p className="text-gray-400 text-sm mt-1 font-medium">Total Listings</p>
          </div>
          <div className="stat-emerald rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-emerald-400">{activeProducts.length}</p>
            <p className="text-gray-400 text-sm mt-1 font-medium">Active</p>
          </div>
          <div className="stat-amber rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-amber-400">{soldProducts.length}</p>
            <p className="text-gray-400 text-sm mt-1 font-medium">Sold</p>
          </div>
          <div className="stat-cyan rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-cyan-400">
              {[...new Set(products.map((p) => p.category))].length}
            </p>
            <p className="text-gray-400 text-sm mt-1 font-medium">Categories</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm animate-slide-down">
            ⚠️ {error}
          </div>
        )}

        {/* Listings */}
        <div className="stitch-card-strong rounded-3xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <h2 className="font-heading text-lg font-semibold text-gray-100">My Listings</h2>
          </div>

          {products.length === 0 ? (
            <div className="p-14 text-center">
              <p className="text-5xl mb-4 animate-float">📦</p>
              <p className="text-gray-500 text-sm mb-5">You haven't listed anything yet.</p>
              <Link
                to="/sell"
                className="stitch-btn text-sm font-semibold px-6 py-2.5 rounded-xl"
              >
                List your first item →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {products.map((product) => (
                <div
                  key={product._id}
                  className={`flex items-center justify-between px-6 py-4 transition-all duration-300 ${
                    product.isSold ? "opacity-50" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-200 truncate">{product.title}</p>
                      {product.isSold && (
                        <span className="stitch-badge-amber text-xs px-2.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                          Sold
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-sm font-bold stitch-gradient-text">₹{product.price.toLocaleString()}</span>
                      <span className="stitch-badge text-xs px-2.5 py-0.5 rounded-full font-medium">{product.category}</span>
                      {product.condition && (
                        <span className="stitch-badge-emerald text-xs px-2.5 py-0.5 rounded-full font-medium">{product.condition}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleSold(product._id, product.isSold)}
                      disabled={togglingId === product._id}
                      className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                        product.isSold
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20"
                      }`}
                    >
                      {togglingId === product._id ? "..." : product.isSold ? "Mark Unsold" : "Mark Sold"}
                    </button>

                    <button
                      onClick={() => navigate(`/edit/${product._id}`)}
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border border-violet-500/20 transition-all duration-300 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="text-xs font-semibold text-rose-400/60 hover:text-rose-400 disabled:text-rose-400/30 transition cursor-pointer"
                    >
                      {deletingId === product._id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;