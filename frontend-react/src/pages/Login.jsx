import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Invalid credentials");
      } else {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
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

        {/* Card */}
        <div className="stitch-card-strong rounded-3xl overflow-hidden">

          {/* Gradient accent line */}
          <div className="stitch-accent-line" />

          <div className="p-8 sm:p-10">

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="text-4xl mb-3">👋</div>
              <h1 className="font-heading text-3xl font-bold text-gray-100">Welcome back</h1>
              <p className="text-gray-500 mt-2 text-sm">Sign in to your Campus Marketplace account</p>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm animate-slide-down">
                ⚠️ {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass("password")}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-rose-400">{errors.password}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full stitch-btn py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-7">
              Don't have an account?{" "}
              <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300 transition">
                Create one
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;