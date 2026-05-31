import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import api from "../lib/api";
import toast from "react-hot-toast";

export default function Checkout() {
  const { items, loading, totalPrice, fetchCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", postalCode: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (items.length === 0) { toast.error("Cart is empty"); return; }
    setSubmitting(true);
    try {
      await api.post("/checkout", form);
      toast.success("Order placed! Check your email for confirmation.");
      fetchCart();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="text-2xl font-bold mb-2">Nothing to checkout</h1>
        <p className="text-gray-500 mb-6">Your cart is empty.</p>
        <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border p-4 space-y-4">
            <h2 className="font-semibold">Contact</h2>
            <input name="email" type="email" placeholder="Email" aria-label="Email" required value={form.email} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input name="phone" type="tel" placeholder="Phone" aria-label="Phone" required value={form.phone} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="bg-white rounded-xl border p-4 space-y-4">
            <h2 className="font-semibold">Shipping</h2>
            <input name="name" placeholder="Full Name" aria-label="Full Name" required value={form.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <input name="address" placeholder="Address" aria-label="Address" required value={form.address} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <div className="grid grid-cols-2 gap-3">
              <input name="city" placeholder="City" aria-label="City" required value={form.city} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input name="postalCode" placeholder="Postal Code" aria-label="Postal Code" required value={form.postalCode} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <textarea name="notes" placeholder="Order notes (optional)" aria-label="Order notes" rows={3} value={form.notes} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors">
            {submitting ? "Placing Order…" : `Place Order — $${totalPrice.toFixed(2)}`}
          </button>
        </form>
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border p-4 sticky top-24">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.product?.image} alt={item.product?.name || ""} loading="lazy" width="48" height="48" className="w-12 h-12 rounded-lg object-contain bg-gray-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
