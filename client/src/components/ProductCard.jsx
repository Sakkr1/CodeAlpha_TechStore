import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function ProductCard({ product, priority }) {
  const { addItem } = useCart();
  const { isLiked, toggleLike } = useWishlist();
  const liked = isLiked(product.id);

  return (
    <div className="glass-card overflow-hidden group animate-scale-in glow-on-hover">
      <Link to={`/products/${product.id}`} className="block aspect-square bg-blue-500/5 flex items-center justify-center p-4 md:p-6 relative">
        <img src={product.image} alt={product.name} width="400" height="400" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
        <button
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-200 ${liked ? 'bg-red-500/10 text-red-400 scale-110' : 'bg-black/20 text-gray-400 hover:text-red-400 backdrop-blur-sm'}`}
          onClick={e => { e.preventDefault(); toggleLike(product.id); }}
        >{liked ? '♥' : '♡'}</button>
      </Link>
      <div className="p-4 md:p-5">
        <Link to={`/products/${product.id}`} className="font-semibold text-sm truncate block hover:text-blue-400 transition-colors">{product.name}</Link>
        <p className="text-blue-400 font-bold mt-1.5 text-base">${product.price.toFixed(2)}</p>
        <button
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2.5 rounded-xl font-medium glow-button active:scale-[0.97]"
          onClick={() => addItem(product.id)}
        >Add to Cart</button>
      </div>
    </div>
  );
}
