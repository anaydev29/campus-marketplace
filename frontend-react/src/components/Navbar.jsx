import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setMobileOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative text-sm font-medium transition-all duration-300 px-3 py-1.5 rounded-lg ${
      isActive(path)
        ? "bg-[var(--bg-card-hover)]"
        : "hover:bg-[var(--bg-card)]"
    }`;

  const NavLinks = () => (
    <>
      <Link to="/" className={linkClass("/")} onClick={() => setMobileOpen(false)}>
        <span className="flex items-center gap-1.5">🏠 Home</span>
        {isActive("/") && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
        )}
      </Link>

      <Link to="/sell" className={linkClass("/sell")} onClick={() => setMobileOpen(false)}>
        <span className="flex items-center gap-1.5">📦 Sell</span>
        {isActive("/sell") && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
        )}
      </Link>

      {token && (
        <>
          <Link to="/wishlist" className={linkClass("/wishlist")} onClick={() => setMobileOpen(false)}>
            <span className="flex items-center gap-1.5">❤️ Wishlist</span>
            {isActive("/wishlist") && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            )}
          </Link>

          <Link to="/dashboard" className={linkClass("/dashboard")} onClick={() => setMobileOpen(false)}>
            <span className="flex items-center gap-1.5">📊 Dashboard</span>
            {isActive("/dashboard") && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            )}
          </Link>

          <Link to="/admin" className={linkClass("/admin")} onClick={() => setMobileOpen(false)}>
            <span className="flex items-center gap-1.5">⚙️ Admin</span>
            {isActive("/admin") && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="text-sm font-medium text-rose-400/70 hover:text-rose-400 transition-all duration-300 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-rose-500/10"
          >
            Logout
          </button>
        </>
      )}

      {!token && (
        <>
          <Link to="/login" className={linkClass("/login")} onClick={() => setMobileOpen(false)}>
            Sign In
          </Link>
          <Link
            to="/register"
            onClick={() => setMobileOpen(false)}
            className="stitch-btn text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl border-b transition-colors duration-300" style={{ background: theme === "dark" ? "rgba(10,10,15,0.80)" : "rgba(245,245,247,0.85)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl group-hover:animate-float">🛒</span>
            <span className="font-heading text-xl font-bold tracking-tight">
              Campus<span className="stitch-gradient-text">Market</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <NavLinks />
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button
              className="flex flex-col gap-1.5 p-2 cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 rounded transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} style={{ background: "var(--text-secondary)" }} />
              <span className={`w-6 h-0.5 rounded transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} style={{ background: "var(--text-secondary)" }} />
              <span className={`w-6 h-0.5 rounded transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: "var(--text-secondary)" }} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 pt-2 flex flex-col gap-3 backdrop-blur-2xl border-t" style={{ background: theme === "dark" ? "rgba(17,17,24,0.95)" : "rgba(255,255,255,0.95)", borderColor: "var(--border-subtle)" }}>
          <NavLinks />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;