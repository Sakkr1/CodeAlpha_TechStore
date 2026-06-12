import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../lib/api";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedQty, setAddedQty] = useState(1);
  const { addItem } = useCart();
  const { isLiked, toggleLike } = useWishlist();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading…</div>;
  if (!product) return <div className="p-8 text-center text-gray-500">Product not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">&larr; Back to products</Link>
      <div className="mt-6 grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="glass-card p-8 md:p-10 flex items-center justify-center">
          <img src={product.image} alt={product.name} width="400" height="400" className="w-full max-w-sm object-contain" loading="lazy" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-gray-500">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-400 mt-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-400 mt-4 leading-relaxed">{product.description}</p>
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <dl className="divide-y divide-[rgba(59,91,255,0.06)] text-sm">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex py-2.5">
                    <dt className="w-1/3 text-gray-500">{key}</dt>
                    <dd className="w-2/3">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <div className="flex items-center border border-white/10 rounded-xl">
              <button className="w-10 h-10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-lg rounded-xl" onClick={() => setAddedQty(q => Math.max(1, q - 1))}>−</button>
              <span className="w-10 text-center font-medium text-sm">{addedQty}</span>
              <button className="w-10 h-10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-lg rounded-xl" onClick={() => setAddedQty(q => q + 1)}>+</button>
            </div>
            <button
              className="flex-1 min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-medium glow-button active:scale-[0.98]"
              onClick={() => addItem(product.id, addedQty)}
            >Add to Cart</button>
            <button
              className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl transition-all duration-200 ${isLiked(product.id) ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}
              onClick={() => toggleLike(product.id)}
            >{isLiked(product.id) ? '♥' : '♡'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
