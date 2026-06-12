import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, loading, totalPrice, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading…</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some products to get started.</p>
        <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium glow-button">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="glass-card p-4 md:p-5 animate-fade-in">
            <div className="sm:flex sm:items-center sm:gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Link to={`/products/${item.product?.id}`} className="w-12 sm:w-20 h-12 sm:h-20 rounded-xl bg-blue-500/5 flex items-center justify-center shrink-0">
                  <img src={item.product?.image} alt={item.product?.name || ""} loading="lazy" className="w-8 sm:w-16 h-8 sm:h-16 object-contain" />
                </Link>
                <div className="min-w-0">
                  <Link to={`/products/${item.product?.id}`} className="font-semibold text-sm hover:text-blue-400 truncate block">{item.product?.name}</Link>
                  <p className="text-blue-400 font-bold mt-1">${(item.product?.price || 0).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:gap-4 mt-3 sm:mt-0 sm:ml-auto">
                <div className="flex items-center gap-2">
                  <button
                    className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border border-white/10 text-gray-400 hover:bg-white/5 transition-colors text-lg leading-none"
                    onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                  >−</button>
                  <span className="w-7 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                  <button
                    className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border border-white/10 text-gray-400 hover:bg-white/5 transition-colors text-lg leading-none"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm sm:text-base">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  <button className="text-xs text-red-400 hover:text-red-300 mt-1 transition-colors" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card p-5 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="font-semibold text-lg">Total</span>
          <span className="text-2xl font-bold text-blue-400 ml-2">${totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 text-center glow-button"
        >Proceed to Checkout</button>
      </div>
    </div>
  );
}
