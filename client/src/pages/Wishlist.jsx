import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Wishlist() {
  const { items, loading, toggleLike } = useWishlist();
  const { addItem } = useCart();

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🤍</p>
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-6">Like products to save them here.</p>
        <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border overflow-hidden group animate-fade-in">
            <Link to={`/products/${item.product?.id}`} className="block aspect-square bg-gray-100 flex items-center justify-center p-4">
              <img src={item.product?.image} alt="" className="w-full h-full object-contain" />
            </Link>
            <div className="p-3">
              <Link to={`/products/${item.product?.id}`} className="font-semibold text-sm truncate block hover:text-blue-600">{item.product?.name}</Link>
              <p className="text-blue-600 font-bold mt-1">${(item.product?.price || 0).toFixed(2)}</p>
              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => addItem(item.product?._id || item.product?.id)}
                >Add to Cart</button>
                <button
                  className="px-2 py-1.5 border rounded-lg text-xs hover:bg-gray-100 transition-colors"
                  onClick={() => toggleLike(item.product?._id || item.product?.id)}
                >♥</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
