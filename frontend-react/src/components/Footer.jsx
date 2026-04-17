import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t mt-auto transition-colors duration-300" style={{ background: "var(--bg-raised)", borderColor: "var(--border-subtle)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-2xl">🛒</span>
              <span className="font-heading text-lg font-bold tracking-tight">
                Campus<span className="stitch-gradient-text">Market</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Buy, sell, and discover great deals within your campus community. Safe, simple, student-first.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-sm transition-colors duration-300 hover:text-violet-400" style={{ color: "var(--text-secondary)" }}>Home</Link>
              <Link to="/sell" className="text-sm transition-colors duration-300 hover:text-violet-400" style={{ color: "var(--text-secondary)" }}>Sell an Item</Link>
              <Link to="/dashboard" className="text-sm transition-colors duration-300 hover:text-violet-400" style={{ color: "var(--text-secondary)" }}>Dashboard</Link>
              <Link to="/wishlist" className="text-sm transition-colors duration-300 hover:text-violet-400" style={{ color: "var(--text-secondary)" }}>Wishlist</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
              Support
            </h4>
            <div className="flex flex-col gap-2.5">
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>📧 support@campusmarket.in</span>
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>🕐 Mon — Sat, 9am — 6pm</span>
            </div>
          </div>

        </div>

        {/* Divider + Copyright */}
        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Campus Marketplace. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Made with ❤️ for campus communities
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
