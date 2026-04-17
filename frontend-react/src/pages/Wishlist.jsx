import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Wishlist() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:5000/api/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleWishlistChange = (productId, wishlisted) => {
    if (!wishlisted) {
      setProducts((prev) => prev.filter((p) => p._id !== productId));
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
          <p className="text-gray-500 text-sm">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto animate-fade-in">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">❤️</span>
            <h1 className="font-heading text-3xl font-bold text-gray-100">My Wishlist</h1>
          </div>
          <p className="text-gray-500 text-sm">
            {products.length === 0
              ? "No saved items yet"
              : `${products.length} saved item${products.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <p className="text-6xl mb-4 animate-float">🤍</p>
            <p className="font-heading text-gray-300 font-semibold text-lg">Your wishlist is empty</p>
            <p className="text-gray-500 text-sm mt-1">
              Tap the heart on any product to save it here
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-6 stitch-btn text-sm font-semibold px-6 py-2.5 rounded-xl cursor-pointer transition-all duration-300"
            >
              Browse Products →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                wishlisted={true}
                onWishlistChange={handleWishlistChange}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Wishlist;