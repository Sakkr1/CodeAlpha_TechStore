import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "./AuthContext.jsx";
import toast from "react-hot-toast";

const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setItems(data.items);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (productId, quantity = 1) => {
    if (!user) { navigate("/login"); return; }
    try {
      const { data } = await api.post("/cart", { productId, quantity });
      toast.success("Added to cart");
      fetchCart();
    } catch { toast.error("Failed to add"); }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) { navigate("/login"); return; }
    try {
      await api.patch(`/cart/${itemId}`, { quantity });
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
    } catch { toast.error("Failed to update"); }
  };

  const removeItem = async (itemId) => {
    if (!user) { navigate("/login"); return; }
    try {
      await api.delete(`/cart/${itemId}`);
      toast.success("Removed from cart");
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch { toast.error("Failed to remove"); }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const totalPrice = items.reduce((sum, i) => sum + i.quantity * (i.product?.price || 0), 0);

  return (
    <CartCtx.Provider value={{ items, loading, totalItems, totalPrice, addItem, updateQuantity, removeItem, fetchCart }}>
      {children}
    </CartCtx.Provider>
  );
}
