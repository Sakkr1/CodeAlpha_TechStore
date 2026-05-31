import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, loading, totalPrice, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Add some products to get started.</p>
        <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl border p-3 sm:p-4 animate-fade-in">
            <div className="sm:flex sm:items-center sm:gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Link to={`/products/${item.product?.id}`} className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <img src={item.product?.image} alt={item.product?.name || ""} loading="lazy" className="w-12 sm:w-16 h-12 sm:h-16 object-contain" />
                </Link>
                <div className="min-w-0">
                  <Link to={`/products/${item.product?.id}`} className="font-semibold text-sm hover:text-blue-600 truncate block">{item.product?.name}</Link>
                  <p className="text-blue-600 font-bold mt-1">${(item.product?.price || 0).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:gap-4 mt-3 sm:mt-0 sm:ml-auto">
                <div className="flex items-center gap-2">
                  <button
                    className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
                    onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                  >−</button>
                  <span className="w-7 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                  <button
                    className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm sm:text-base">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  <button className="text-xs text-red-500 hover:text-red-700 mt-1 transition-colors" onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border p-4 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="font-semibold text-lg">Total</span>
          <span className="text-2xl font-bold text-indigo-600 ml-2">${totalPrice.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors text-center"
        >Proceed to Checkout</button>
      </div>
    </div>
  );
}
