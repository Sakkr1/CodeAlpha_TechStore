import { useEffect, useState } from "react";
import api from "../lib/api";
import toast from "react-hot-toast";

const CATEGORIES = ["laptops", "phones", "tablets", "other"];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: "", category: "other", specsKey: "", specsVal: "" });
  const [specs, setSpecs] = useState({});

  const fetchProducts = () => {
    api.get("/products")
      .then(({ data }) => setProducts(data.products))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const addSpec = () => {
    if (!form.specsKey) return;
    setSpecs(prev => ({ ...prev, [form.specsKey]: form.specsVal }));
    setForm({ ...form, specsKey: "", specsVal: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: form.image,
        category: form.category,
        specs: Object.keys(specs).length ? specs : undefined,
      });
      toast.success("Product added");
      setShowForm(false);
      setForm({ name: "", description: "", price: "", image: "", category: "other", specsKey: "", specsVal: "" });
      setSpecs({});
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to add product");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-medium glow-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 mb-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40" placeholder="Product name" aria-label="Product name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40" placeholder="Price" aria-label="Price" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40 col-span-2" placeholder="Image URL" aria-label="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
            <textarea className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40 col-span-2" placeholder="Description" aria-label="Description" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Specifications (optional)</p>
            <div className="flex gap-2">
              <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40 flex-1" placeholder="Key (e.g. CPU)" aria-label="Spec key" value={form.specsKey} onChange={e => setForm({...form, specsKey: e.target.value})} />
              <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40 flex-1" placeholder="Value (e.g. Intel i7)" aria-label="Spec value" value={form.specsVal} onChange={e => setForm({...form, specsVal: e.target.value})} />
              <button type="button" className="bg-white/10 px-4 py-2 rounded-xl text-sm hover:bg-white/15 transition-colors" onClick={addSpec}>Add</button>
            </div>
            {Object.keys(specs).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {Object.entries(specs).map(([k, v]) => (
                  <span key={k} className="bg-white/5 text-xs px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/5">
                    {k}: {v}
                    <button type="button" className="text-red-400 ml-1 hover:text-red-300" onClick={() => { const s = {...specs}; delete s[k]; setSpecs(s); }}>&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 font-medium glow-button" style={{ boxShadow: "0 4px 24px rgba(5, 150, 105, 0.25)" }}>Add Product</button>
        </form>
      )}

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[rgba(59,91,255,0.06)]">
              <th className="text-left px-4 py-3.5 font-medium text-gray-400">Product</th>
              <th className="text-left px-4 py-3.5 font-medium text-gray-400 hidden sm:table-cell">Category</th>
              <th className="text-right px-4 py-3.5 font-medium text-gray-400">Price</th>
              <th className="text-right px-4 py-3.5 font-medium text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(59,91,255,0.06)]">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3.5 flex items-center gap-3">
                  <img src={p.image} alt={p.name} loading="lazy" className="w-10 h-10 rounded-xl object-contain bg-blue-500/5" />
                  <span className="truncate max-w-[200px]">{p.name}</span>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell text-gray-500 capitalize">{p.category}</td>
                <td className="px-4 py-3.5 text-right font-medium text-blue-400">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3.5 text-right">
                  <button className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-gray-500">No products.</p>}
      </div>
    </div>
  );
}
