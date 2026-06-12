import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const handleSearch = (e) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (val) { params.set("search", val); } else { params.delete("search"); }
    setSearchParams(params, { replace: true });
  };

  const linkClass = "hover:text-blue-400 transition-all hover:-translate-y-[1px] text-sm";
  const mobileLinkClass = "block px-4 py-2.5 hover:bg-white/5 rounded-xl transition-colors text-sm";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ backgroundColor: 'var(--navbar-bg)', borderColor: 'var(--navbar-border)' }}>
      <div className="relative mx-auto max-w-6xl w-full flex items-center justify-between px-3 md:px-4 h-16">
        <Link to="/" className="text-lg font-bold tracking-tight shrink-0 hover:text-blue-400 transition-colors" onClick={() => setOpen(false)}>
          <span className="text-blue-400">TechStore</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all"
              aria-label="Search products"
            />
          </div>
        </div>
        <div className="flex items-center md:hidden">
          <button
            className="w-9 h-9 flex items-center justify-center text-xl hover:bg-white/5 transition-colors rounded-lg"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
        <nav className="hidden md:flex items-center gap-5">
          <Link to="/" className={linkClass}>Products</Link>
          {user ? (
            <>
              <Link to="/wishlist" className={linkClass}>Wishlist</Link>
              <Link to="/cart" className={`${linkClass} relative`}>
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-4 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems}</span>
                )}
              </Link>
              {user.isAdmin && <Link to="/admin" className={linkClass}>Admin</Link>}
              <div className="flex items-center gap-3 ml-2">
                <span className="text-gray-500 hidden lg:inline text-xs">{user.name}</span>
                <button className="text-red-400 hover:text-red-300 transition-all hover:-translate-y-[1px] text-sm" onClick={() => { logout(); nav("/login"); }}>Logout</button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 ml-2">
              <Link to="/login" className="border border-white/10 text-white/80 px-4 py-1.5 rounded-full text-xs font-medium hover:bg-white/5 hover:text-white transition-all">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-medium glow-button">Register</Link>
            </div>
          )}
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm hover:bg-white/10 transition-all hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} />
          <div className="md:hidden absolute top-full left-0 right-0 z-50 backdrop-blur-xl px-4 py-4 space-y-1 text-sm animate-fade-in shadow-xl border-t" style={{ backgroundColor: 'var(--navbar-mobile-bg)', borderColor: 'var(--navbar-mobile-border)' }}>
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={handleSearch}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40"
                aria-label="Search products"
              />
            </div>
            <Link to="/" className={mobileLinkClass} onClick={() => setOpen(false)}>Products</Link>
            {user ? (
              <>
                <Link to="/wishlist" className={mobileLinkClass} onClick={() => setOpen(false)}>Wishlist</Link>
                <Link to="/cart" className={mobileLinkClass} onClick={() => setOpen(false)}>
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Link>
                {user.isAdmin && <Link to="/admin" className={mobileLinkClass} onClick={() => setOpen(false)}>Admin</Link>}
                <div className="px-4 py-2 text-gray-500 text-xs">{user.name}</div>
                <button className="block w-full text-left px-4 py-2.5 text-red-400 hover:bg-white/5 rounded-xl transition-colors" onClick={() => { logout(); nav("/login"); setOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className={mobileLinkClass} onClick={() => setOpen(false)}>Login</Link>
                <Link to="/register" className={mobileLinkClass} onClick={() => setOpen(false)}>Register</Link>
              </>
            )}
            <div className="px-4 pt-2">
              <button
                onClick={toggle}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm hover:bg-white/10 transition-all hover:scale-110"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
