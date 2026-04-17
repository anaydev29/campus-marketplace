import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          contact: form.phone || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Registration failed");
      } else {
        navigate("/login");
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-scale-in">

        <div className="stitch-card-strong rounded-3xl overflow-hidden">

          {/* Gradient accent line */}
          <div className="stitch-accent-line" />

          <div className="p-8 sm:p-10">

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h1 className="font-heading text-3xl font-bold text-gray-100">Create account</h1>
              <p className="text-gray-500 mt-2 text-sm">Join Campus Marketplace today</p>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm animate-slide-down">
                ⚠️ {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                <input
                  type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="John Doe" className={inputClass("name")}
                />
                {errors.name && <p className="mt-1.5 text-xs text-rose-400">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className={inputClass("email")}
                />
                {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
              </div>

              {/* Phone (optional) */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Phone Number
                  <span className="ml-1 text-gray-600 font-normal">(optional — shown to buyers)</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-white/[0.08] bg-white/[0.03] text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    placeholder="98765 43210" maxLength={10}
                    className={`flex-1 px-4 py-3 rounded-r-xl text-sm stitch-input ${
                      errors.phone ? "stitch-input-error" : ""
                    }`}
                  />
                </div>
                {errors.phone && <p className="mt-1.5 text-xs text-rose-400">{errors.phone}</p>}
                <p className="mt-1 text-xs text-gray-600">
                  If added, buyers can call or WhatsApp you directly.
                </p>
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                <input
                  type="password" name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" className={inputClass("password")}
                />
                {errors.password && <p className="mt-1.5 text-xs text-rose-400">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="mb-7">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
                <input
                  type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  placeholder="••••••••" className={inputClass("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-rose-400">{errors.confirmPassword}</p>
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
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

            </form>

            <p className="text-center text-sm text-gray-500 mt-7">
              Already have an account?{" "}
              <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition">
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;