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

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;
  if (!product) return <div className="p-8 text-center text-gray-400">Product not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/" className="text-blue-600 hover:underline text-sm">&larr; Back to products</Link>
      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border p-8 flex items-center justify-center">
          <img src={product.image} alt={product.name} width="400" height="400" className="w-full max-w-sm object-contain" loading="lazy" />
        </div>
        <div>
          <span className="text-xs uppercase tracking-wider text-gray-400">{product.category}</span>
          <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
          <p className="text-3xl font-bold text-blue-600 mt-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Specifications</h3>
              <dl className="divide-y text-sm">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex py-2">
                    <dt className="w-1/3 text-gray-500">{key}</dt>
                    <dd className="w-2/3">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="flex items-center border rounded-lg">
              <button className="w-9 h-9 text-gray-500 hover:bg-gray-100 transition-colors text-lg" onClick={() => setAddedQty(q => Math.max(1, q - 1))}>−</button>
              <span className="w-9 text-center font-medium text-sm">{addedQty}</span>
              <button className="w-9 h-9 text-gray-500 hover:bg-gray-100 transition-colors text-lg" onClick={() => setAddedQty(q => q + 1)}>+</button>
            </div>
            <button
              className="flex-1 min-w-[140px] bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 active:scale-[0.98] transition-all duration-150"
              onClick={() => addItem(product.id, addedQty)}
            >Add to Cart</button>
            <button
              className={`w-11 h-11 rounded-lg border flex items-center justify-center text-xl transition-all duration-200 ${isLiked(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'hover:bg-gray-50 text-gray-400'}`}
              onClick={() => toggleLike(product.id)}
            >{isLiked(product.id) ? '♥' : '♡'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
