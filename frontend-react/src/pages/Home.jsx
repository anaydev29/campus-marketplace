import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const CATEGORIES = [
  { name: "All", icon: "✨" },
  { name: "Books", icon: "📚" },
  { name: "Electronics", icon: "💻" },
  { name: "Clothing", icon: "👕" },
  { name: "Furniture", icon: "🪑" },
  { name: "Flats & Rooms", icon: "🏠" },
  { name: "Sports", icon: "⚽" },
  { name: "Stationery", icon: "✏️" },
  { name: "Other", icon: "📦" },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWishlistIds(data.map((p) => p._id));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category !== "All") params.append("category", category);
    if (sort === "price_asc") params.append("sort", "price_asc");
    if (sort === "price_desc") params.append("sort", "price_desc");

    fetch(`http://localhost:5000/api/products?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setProducts([]);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [search, category, sort]);

  const handleWishlistChange = (productId, wishlisted) => {
    setWishlistIds((prev) =>
      wishlisted ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("newest");
  };

  const hasActiveFilters = search || category !== "All" || sort !== "newest";

  return (
    <div className="min-h-screen">

      {/* ========== HERO SECTION ========== */}
      <section className="stitch-hero text-white py-20 sm:py-28 px-4">
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in">

          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-xs font-medium mb-6 animate-scale-in">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Trusted by 500+ students
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.1]">
            Your Campus,{" "}
            <span className="stitch-gradient-text">Your Marketplace</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Buy and sell textbooks, electronics, furniture, and more — all within your campus community. Fast, safe, and student-friendly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/sell"
              className="stitch-btn text-sm sm:text-base font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
            >
              Start Selling →
            </Link>
            <a
              href="#browse"
              className="stitch-btn-ghost text-sm sm:text-base font-semibold px-8 py-3.5 rounded-full transition-all duration-300"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>

      {/* ========== BROWSE SECTION ========== */}
      <section id="browse" className="max-w-7xl mx-auto px-4 py-14">

        {/* Section Header */}
        <div className="mb-8 animate-fade-in">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-100">
            Browse Products
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Find great deals from your campus community
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 animate-fade-in">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for books, electronics, clothing..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl stitch-input text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8 animate-fade-in">

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  category === cat.name
                    ? "stitch-btn shadow-lg scale-105"
                    : "stitch-card text-gray-400 hover:text-white hover:border-violet-500/20"
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl stitch-input text-sm cursor-pointer"
          >
            <option value="newest">🕐 Newest First</option>
            <option value="price_asc">💰 Price: Low → High</option>
            <option value="price_desc">💎 Price: High → Low</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2.5 rounded-xl border border-rose-500/20 text-rose-400 text-sm hover:bg-rose-500/10 transition cursor-pointer"
            >
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-600 mb-6">
            {products.length === 0
              ? "No products found"
              : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
          </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-10 h-10 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
            </div>
            <p className="text-gray-500 text-sm">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <p className="text-6xl mb-4 animate-float">🔍</p>
            <p className="text-gray-300 font-heading font-semibold text-lg">No products found</p>
            <p className="text-gray-500 text-sm mt-1">Try a different search or category</p>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="mt-5 stitch-btn text-sm px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {products.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                wishlisted={wishlistIds.includes(p._id)}
                onWishlistChange={handleWishlistChange}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;