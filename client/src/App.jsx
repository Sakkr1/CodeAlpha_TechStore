import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LoadingProvider } from "./context/LoadingContext.jsx";
import Navbar from "./components/Navbar.jsx";
import LoadingBanner from "./components/LoadingBanner.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen flex flex-col overflow-x-hidden">
          <LoadingBanner />
          <Navbar />
          <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Protected><Cart /></Protected>} />
            <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
            <Route path="/wishlist" element={<Protected><Wishlist /></Protected>} />
            <Route path="/admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </main>
          <Footer />
        </div>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
