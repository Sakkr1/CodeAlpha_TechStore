import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "./AuthContext.jsx";
import toast from "react-hot-toast";

const WishlistCtx = createContext(null);
export const useWishlist = () => useContext(WishlistCtx);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const likedProductIds = new Set(items.map(i => i.product?._id || i.product?.id));

  const fetchWishlist = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const { data } = await api.get("/wishlist");
      setItems(data.items);
    } catch { setItems([]); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleLike = async (productId) => {
    if (!user) { navigate("/login"); return; }
    try {
      const { data } = await api.post("/wishlist", { productId });
      if (data.liked) {
        toast.success("Added to wishlist");
      } else {
        toast("Removed from wishlist");
      }
      fetchWishlist();
    } catch { toast.error("Failed"); }
  };

  const isLiked = (productId) => likedProductIds.has(productId);

  return (
    <WishlistCtx.Provider value={{ items, loading, isLiked, toggleLike, fetchWishlist }}>
      {children}
    </WishlistCtx.Provider>
  );
}
