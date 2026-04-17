import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["Books", "Electronics", "Clothing", "Furniture", "Flats & Rooms", "Sports", "Stationery", "Other"];
const MAX_IMAGES = 3;

function Sell() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(form.price) || Number(form.price) <= 0) {
      newErrors.price = "Enter a valid price";
    }
    if (!form.category) newErrors.category = "Please select a category";
    if (!form.condition) newErrors.condition = "Please select a condition";
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);
    const newPreviews = toAdd.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...toAdd]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setServerError("Video must be under 50MB");
      return;
    }
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideo(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", Number(form.price));
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      images.forEach((img) => formData.append("images", img));
      if (video) formData.append("video", video);

      const res = await fetch("http://localhost:5000/api/products/add", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Failed to list product");
      } else {
        setSuccess(true);
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    } catch {
      setServerError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl text-sm stitch-input ${
      errors[field] ? "stitch-input-error" : ""
    }`;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="stitch-card-strong rounded-3xl p-12 text-center max-w-sm w-full animate-scale-in">
          <div className="text-6xl mb-4 animate-float">🎉</div>
          <h2 className="font-heading text-2xl font-bold text-gray-100 mb-2">Product Listed!</h2>
          <p className="text-gray-500 text-sm">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="w-full max-w-xl mx-auto animate-fade-in">
        <div className="stitch-card-strong rounded-3xl overflow-hidden">

          {/* Gradient accent line */}
          <div className="stitch-accent-line" />

          <div className="p-8 sm:p-10">

            <div className="mb-8">
              <div className="text-3xl mb-2">📦</div>
              <h1 className="font-heading text-3xl font-bold text-gray-100">List a Product</h1>
              <p className="text-gray-500 mt-1 text-sm">Fill in the details to sell your item</p>
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
                  placeholder="e.g. Engineering Mathematics Textbook" className={inputClass("title")} />
                {errors.title && <p className="mt-1.5 text-xs text-rose-400">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  placeholder="Describe your product — condition, edition, reason for selling..."
                  rows={4} className={`${inputClass("description")} resize-none`} />
                {errors.description && <p className="mt-1.5 text-xs text-rose-400">{errors.description}</p>}
              </div>

              {/* Price */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (₹)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange}
                  placeholder="e.g. 500" min="1" className={inputClass("price")} />
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

              {/* Multi Image Upload */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Product Images <span className="text-gray-600 font-normal">(optional, up to {MAX_IMAGES})</span>
                  </label>
                  <span className="text-xs text-gray-500 font-medium">{images.length} / {MAX_IMAGES}</span>
                </div>

                {/* Previews grid */}
                {previews.length > 0 && (
                  <div className="flex gap-3 mb-3">
                    {previews.map((src, index) => (
                      <div key={index} className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/[0.08] flex-shrink-0">
                        <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1.5 right-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center transition cursor-pointer"
                        >
                          ✕
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1.5 left-1.5 stitch-btn text-[10px] px-2 py-0.5 rounded-md">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}

                    {/* Add more slot */}
                    {images.length < MAX_IMAGES && (
                      <label className="w-28 h-28 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.1] rounded-2xl cursor-pointer hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300">
                        <span className="text-2xl text-gray-500">+</span>
                        <span className="text-xs text-gray-500 mt-1">Add more</span>
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                )}

                {/* Initial upload area */}
                {previews.length === 0 && (
                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/[0.1] rounded-2xl cursor-pointer hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 group">
                    <span className="text-3xl mb-2 group-hover:animate-float">📷</span>
                    <span className="text-sm text-gray-400">Click to upload images</span>
                    <span className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP — up to {MAX_IMAGES} images</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Video Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Video <span className="text-gray-600 font-normal">(optional, max 50MB)</span>
                </label>

                {videoPreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-48 object-cover bg-black rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-600 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition cursor-pointer"
                    >
                      ✕ Remove
                    </button>
                    <span className="absolute bottom-2 left-2 stitch-badge-cyan text-[10px] px-2.5 py-1 rounded-full font-semibold">
                      🎬 Video
                    </span>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-white/[0.1] rounded-2xl cursor-pointer hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300 group">
                    <span className="text-3xl mb-2 group-hover:animate-float">🎬</span>
                    <span className="text-sm text-gray-400">Click to upload a video</span>
                    <span className="text-xs text-gray-600 mt-1">MP4, WEBM, MOV — max 50MB</span>
                    <input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={handleVideoChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit" disabled={loading}
                className="w-full stitch-btn py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Listing product...
                  </span>
                ) : (
                  "List Product →"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sell;