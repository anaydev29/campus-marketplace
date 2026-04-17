import { useNavigate } from "react-router-dom";
import { useState } from "react";

function ProductCard({ product, wishlisted = false, onWishlistChange }) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(wishlisted);
  const [loading, setLoading] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);

    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${product._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setIsWishlisted(data.wishlisted);
        if (onWishlistChange) onWishlistChange(product._id, data.wishlisted);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stitch-card-glow rounded-2xl overflow-hidden group hover:-translate-y-2 transition-all duration-500">

      {/* Image */}
      <div className="relative overflow-hidden">
        {product.images?.length > 0 || product.image ? (
          <img
            src={`http://localhost:5000/uploads/${product.images?.[0] || product.image}`}
            alt={product.title}
            className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 flex items-center justify-center text-5xl">
            📦
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          disabled={loading}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
            heartAnim ? "scale-125" : "scale-100"
          } ${
            isWishlisted
              ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              : "bg-black/40 backdrop-blur-sm text-gray-300 hover:text-rose-400 hover:bg-black/60"
          }`}
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-semibold bg-black/40 backdrop-blur-sm text-gray-200 px-2.5 py-1 rounded-full border border-white/10">
            {product.category}
          </span>
        </div>

        {/* Video indicator */}
        {product.video && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] font-bold bg-cyan-500/80 backdrop-blur-sm text-black px-2 py-0.5 rounded-full">
              🎬 Video
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading text-base font-semibold text-gray-100 mb-2 truncate">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-bold stitch-gradient-text">₹{product.price.toLocaleString()}</p>
          {product.condition && (
            <span className="stitch-badge-emerald text-xs font-medium px-2.5 py-1 rounded-full">
              {product.condition}
            </span>
          )}
        </div>

        <button
          onClick={() => navigate(`/product/${product._id}`)}
          className="w-full stitch-btn text-sm py-2.5 rounded-xl cursor-pointer transition-all duration-300"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}

export default ProductCard;