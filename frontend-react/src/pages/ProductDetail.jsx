import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch(() => setError("Product not found or has been removed."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-10 h-10 mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
          </div>
          <p className="text-gray-500 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="stitch-card-strong rounded-3xl p-12 text-center max-w-sm animate-scale-in">
          <p className="text-5xl mb-4">😕</p>
          <h2 className="font-heading text-xl font-bold text-gray-100 mb-2">Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button onClick={() => navigate("/")}
            className="stitch-btn text-sm font-semibold px-6 py-2.5 rounded-xl cursor-pointer">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const seller = product.seller;
  const whatsappNumber = seller?.contact?.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in your listing: "${product.title}" priced at ₹${product.price}. Is it still available?`
  );

  const imageList = product.images?.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">

        <button onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-500 hover:text-violet-400 flex items-center gap-1.5 transition-all duration-300 cursor-pointer group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
        </button>

        <div className="stitch-card-strong rounded-3xl overflow-hidden">

          {/* Main Image */}
          {imageList.length > 0 ? (
            <div>
              <div className="w-full h-80 sm:h-96 overflow-hidden relative" style={{background: "var(--bg-raised)"}}>
                <img
                  src={`http://localhost:5000/uploads/${imageList[activeImage]}`}
                  alt={`Product image ${activeImage + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Scrollable Thumbnails */}
              {imageList.length > 1 && (
                <div className="flex gap-3 px-6 py-4 overflow-x-auto border-b" style={{background: "var(--bg-raised)", borderColor: "var(--border-subtle)"}}>
                  {imageList.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-18 h-18 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                        i === activeImage
                          ? "border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)] scale-105"
                          : "border-transparent hover:border-white/20 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={`http://localhost:5000/uploads/${img}`}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-80 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 flex items-center justify-center text-7xl">
              📦
            </div>
          )}

          {/* Video Player */}
          {product.video && (
            <div className="px-6 py-4 border-b" style={{background: "var(--bg-raised)", borderColor: "var(--border-subtle)"}}>
              <div className="flex items-center gap-2 mb-3">
                <span className="stitch-badge-cyan text-xs font-semibold px-3 py-1 rounded-full">🎬 Product Video</span>
              </div>
              <video
                src={`http://localhost:5000/uploads/${product.video}`}
                controls
                className="w-full rounded-2xl border border-white/[0.06] bg-black"
                style={{ maxHeight: "400px" }}
              />
            </div>
          )}

          <div className="p-8 sm:p-10">

            {/* Title & Price */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-100">{product.title}</h1>
              <span className="text-2xl sm:text-3xl font-bold stitch-gradient-text flex-shrink-0">
                ₹{product.price.toLocaleString()}
              </span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="stitch-badge text-xs font-semibold px-3.5 py-1.5 rounded-full">
                {product.category}
              </span>
              {product.condition && (
                <span className="stitch-badge-emerald text-xs font-semibold px-3.5 py-1.5 rounded-full">
                  {product.condition}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="font-heading text-sm font-semibold text-gray-300 mb-2">Description</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
            </div>

            <div className="border-t border-white/[0.06] my-7" />

            {/* Seller + Contact */}
            {seller && (
              <div>
                <h2 className="font-heading text-sm font-semibold text-gray-300 mb-3">Seller</h2>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg stitch-glow-ring">
                    {seller.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{seller.name}</p>
                    <p className="text-xs text-gray-500">Campus Marketplace Seller</p>
                  </div>
                </div>

                {!showContact ? (
                  <button
                    onClick={() => setShowContact(true)}
                    className="w-full stitch-btn py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300"
                  >
                    📞 Show Contact Details
                  </button>
                ) : (
                  <div className="stitch-card rounded-2xl p-5 space-y-3 animate-slide-down">
                    <p className="text-sm font-semibold text-gray-300 mb-1">Contact Seller</p>

                    {seller.email && (
                      <a
                        href={`mailto:${seller.email}?subject=Interested in: ${product.title}&body=Hi ${seller.name}, I'm interested in your listing "${product.title}" priced at ₹${product.price}. Is it still available?`}
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300"
                      >
                        <span className="text-xl">✉️</span>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-200">{seller.email}</p>
                        </div>
                      </a>
                    )}

                    {seller.contact && (
                      <a
                        href={`tel:${seller.contact}`}
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300"
                      >
                        <span className="text-xl">📞</span>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-200">+91 {seller.contact}</p>
                        </div>
                      </a>
                    )}

                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/91${whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
                      >
                        <span className="text-xl">💬</span>
                        <div>
                          <p className="text-xs text-emerald-400">WhatsApp</p>
                          <p className="text-sm font-medium text-emerald-300">Chat on WhatsApp</p>
                        </div>
                      </a>
                    )}

                    {!seller.contact && (
                      <p className="text-xs text-gray-600 text-center pt-1">
                        📵 Seller hasn't added a phone number. Email them above.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-gray-600 mt-7">
              Listed on {new Date(product.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;