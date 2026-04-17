import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CATEGORIES = ["Books", "Electronics", "Clothing", "Furniture", "Flats & Rooms", "Sports", "Stationery", "Other"];
const MAX_IMAGES = 3;

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingVideo, setExistingVideo] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [newVideoPreview, setNewVideoPreview] = useState(null);
  const [keepVideo, setKeepVideo] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "",
          condition: data.condition || "",
        });
        setExistingImages(data.images?.length > 0 ? data.images : data.image ? [data.image] : []);
        setExistingVideo(data.video || null);
        setKeepVideo(!!data.video);
      })
      .catch(() => setServerError("Failed to load product."))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
      newErrors.price = "Enter a valid price";
    if (!form.category) newErrors.category = "Please select a category";
    if (!form.condition) newErrors.condition = "Please select a condition";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleRemoveExisting = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const totalAllowed = MAX_IMAGES - existingImages.length - newImages.length;
    const toAdd = files.slice(0, totalAllowed);
    setNewImages((prev) => [...prev, ...toAdd]);
    setNewPreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const handleRemoveNew = (index) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setServerError("Video must be under 50MB");
      return;
    }
    if (newVideoPreview) URL.revokeObjectURL(newVideoPreview);
    setNewVideo(file);
    setNewVideoPreview(URL.createObjectURL(file));
    setExistingVideo(null);
    setKeepVideo(false);
    e.target.value = "";
  };

  const handleRemoveExistingVideo = () => {
    setExistingVideo(null);
    setKeepVideo(false);
  };

  const handleRemoveNewVideo = () => {
    if (newVideoPreview) URL.revokeObjectURL(newVideoPreview);
    setNewVideo(null);
    setNewVideoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", Number(form.price));
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      formData.append("keepImages", JSON.stringify(existingImages));
      formData.append("keepVideo", keepVideo ? "true" : "false");
      newImages.forEach((img) => formData.append("images", img));
      if (newVideo) formData.append("video", newVideo);

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Failed to update product");
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch {
      setServerError("Server error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl text-sm stitch-input ${
      errors[field] ? "stitch-input-error" : ""
    }`;

  const totalImages = existingImages.length + newImages.length;
  const hasAnyVideo = existingVideo || newVideo;

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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="stitch-card-strong rounded-3xl p-12 text-center max-w-sm w-full animate-scale-in">
          <div className="text-6xl mb-4 animate-float">✅</div>
          <h2 className="font-heading text-2xl font-bold text-gray-100 mb-2">Listing Updated!</h2>
          <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="w-full max-w-xl mx-auto animate-fade-in">
        <button onClick={() => navigate("/dashboard")}
          className="mb-6 text-sm text-gray-500 hover:text-violet-400 flex items-center gap-1.5 transition-all duration-300 cursor-pointer group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
        </button>

        <div className="stitch-card-strong rounded-3xl overflow-hidden">

          {/* Gradient accent line */}
          <div className="stitch-accent-line" />

          <div className="p-8 sm:p-10">
            <div className="mb-8">
              <div className="text-3xl mb-2">✏️</div>
              <h1 className="font-heading text-3xl font-bold text-gray-100">Edit Listing</h1>
              <p className="text-gray-500 mt-1 text-sm">Update your product details</p>
            </div>

            {serverError && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm animate-slide-down">
                ⚠️ {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Title */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Product Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange}
                  className={inputClass("title")} />
                {errors.title && <p className="mt-1.5 text-xs text-rose-400">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={4} className={`${inputClass("description")} resize-none`} />
                {errors.description && <p className="mt-1.5 text-xs text-rose-400">{errors.description}</p>}
              </div>

              {/* Price */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (₹)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange}
                  min="1" className={inputClass("price")} />
                {errors.price && <p className="mt-1.5 text-xs text-rose-400">{errors.price}</p>}
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputClass("category")}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  {errors.category && <p className="mt-1.5 text-xs text-rose-400">{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Condition</label>
                  <select name="condition" value={form.condition} onChange={handleChange} className={inputClass("condition")}>
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                  {errors.condition && <p className="mt-1.5 text-xs text-rose-400">{errors.condition}</p>}
                </div>
              </div>

              {/* Images */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Images <span className="text-gray-600 font-normal">(up to {MAX_IMAGES})</span>
                  </label>
                  <span className="text-xs text-gray-500 font-medium">{totalImages} / {MAX_IMAGES}</span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {existingImages.map((img, i) => (
                    <div key={`existing-${i}`} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/[0.08]">
                      <img src={`http://localhost:5000/uploads/${img}`} alt={`Image ${i + 1}`}
                        className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveExisting(i)}
                        className="absolute top-1.5 right-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center transition cursor-pointer">
                        ✕
                      </button>
                      {i === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 stitch-btn text-[10px] px-1.5 py-0.5 rounded-md">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}

                  {newPreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-violet-500/20">
                      <img src={src} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => handleRemoveNew(i)}
                        className="absolute top-1.5 right-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center transition cursor-pointer">
                        ✕
                      </button>
                      <span className="absolute bottom-1.5 left-1.5 bg-violet-500 text-white text-[10px] px-1.5 py-0.5 rounded-md">
                        New
                      </span>
                    </div>
                  ))}

                  {totalImages < MAX_IMAGES && (
                    <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.1] rounded-2xl cursor-pointer hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300">
                      <span className="text-2xl text-gray-500">+</span>
                      <span className="text-xs text-gray-500">Add</span>
                      <input type="file" accept="image/*" multiple onChange={handleNewImages} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Video */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Video <span className="text-gray-600 font-normal">(optional, max 50MB)</span>
                </label>

                {existingVideo && (
                  <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] mb-3">
                    <video
                      src={`http://localhost:5000/uploads/${existingVideo}`}
                      controls
                      className="w-full h-40 object-cover bg-black rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveExistingVideo}
                      className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                    <span className="absolute bottom-2 left-2 stitch-badge-cyan text-[10px] px-2.5 py-1 rounded-full font-semibold">
                      🎬 Current Video
                    </span>
                  </div>
                )}

                {newVideoPreview && (
                  <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 mb-3">
                    <video
                      src={newVideoPreview}
                      controls
                      className="w-full h-40 object-cover bg-black rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveNewVideo}
                      className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                    <span className="absolute bottom-2 left-2 bg-cyan-500 text-black text-[10px] px-2.5 py-1 rounded-full font-semibold">
                      🎬 New Video
                    </span>
                  </div>
                )}

                {!hasAnyVideo && (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/[0.1] rounded-2xl cursor-pointer hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 group">
                    <span className="text-2xl mb-1 group-hover:animate-float">🎬</span>
                    <span className="text-sm text-gray-400">Upload a video</span>
                    <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={saving}
                className="w-full stitch-btn py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all duration-300">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving changes...
                  </span>
                ) : (
                  "Save Changes →"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;