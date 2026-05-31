import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();

  const linkClass = "hover:text-indigo-400 transition-all hover:-translate-y-[1px]";
  const mobileLinkClass = "block px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors";

  return (
    <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-14">
        <Link to="/" className="text-lg font-bold tracking-tight" onClick={() => setOpen(false)}>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">TechStore</span>
        </Link>
        <div className="flex items-center md:hidden">
          <button
            className="w-8 h-8 flex items-center justify-center text-xl"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/" className={linkClass}>Products</Link>
          {user ? (
            <>
              <Link to="/wishlist" className={linkClass}>Wishlist</Link>
              <Link to="/cart" className={`${linkClass} relative`}>
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{totalItems}</span>
                )}
              </Link>
              {user.isAdmin && <Link to="/admin" className={linkClass}>Admin</Link>}
              <span className="text-gray-400 hidden lg:inline text-xs">{user.name}</span>
              <button className="text-red-400 hover:text-red-300 transition-all hover:-translate-y-[1px]" onClick={() => { logout(); nav("/login"); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Login</Link>
              <Link to="/register" className={linkClass}>Register</Link>
            </>
          )}
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-all hover:scale-110"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </nav>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white dark:bg-slate-900 px-4 py-3 space-y-1 text-sm animate-fade-in">
          <Link to="/" className={mobileLinkClass} onClick={() => setOpen(false)}>Products</Link>
          {user ? (
            <>
              <Link to="/wishlist" className={mobileLinkClass} onClick={() => setOpen(false)}>Wishlist</Link>
              <Link to="/cart" className={mobileLinkClass} onClick={() => setOpen(false)}>
                Cart {totalItems > 0 && `(${totalItems})`}
              </Link>
              {user.isAdmin && <Link to="/admin" className={mobileLinkClass} onClick={() => setOpen(false)}>Admin</Link>}
              <div className="px-4 py-2 text-gray-400 text-xs">{user.name}</div>
              <button className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors" onClick={() => { logout(); nav("/login"); setOpen(false); }}>Logout</button>
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
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-slate-600 transition-all hover:scale-110"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
