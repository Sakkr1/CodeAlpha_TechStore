import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function ProductCard({ product, priority }) {
  const { addItem } = useCart();
  const { isLiked, toggleLike } = useWishlist();
  const liked = isLiked(product.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden group animate-fade-in">
      <Link to={`/products/${product.id}`} className="block aspect-square bg-gray-100 flex items-center justify-center p-6 relative">
        <img src={product.image} alt={product.name} width="400" height="400" className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
        <button
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${liked ? 'bg-red-50 text-red-500 scale-110' : 'bg-white/80 text-gray-400 hover:text-red-400'}`}
          onClick={e => { e.preventDefault(); toggleLike(product.id); }}
        >{liked ? '♥' : '♡'}</button>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`} className="font-semibold text-sm truncate block hover:text-blue-600 transition-colors">{product.name}</Link>
        <p className="text-blue-600 font-bold mt-1">${product.price.toFixed(2)}</p>
        <button
          className="mt-3 w-full bg-blue-600 text-white text-xs py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-[0.97] transition-all duration-150"
          onClick={() => addItem(product.id)}
        >Add to Cart</button>
      </div>
    </div>
  );
}
