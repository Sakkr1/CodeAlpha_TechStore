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

  if (loading) return <div className="p-8 text-center text-gray-400">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Product name" aria-label="Product name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Price" aria-label="Price" type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <input className="border rounded-lg px-3 py-2 text-sm col-span-2" placeholder="Image URL" aria-label="Image URL" value={form.image} onChange={e => setForm({...form, image: e.target.value})} required />
            <textarea className="border rounded-lg px-3 py-2 text-sm col-span-2" placeholder="Description" aria-label="Description" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            <select className="border rounded-lg px-3 py-2 text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Specifications (optional)</p>
            <div className="flex gap-2">
              <input className="border rounded-lg px-3 py-2 text-sm flex-1" placeholder="Key (e.g. CPU)" aria-label="Spec key" value={form.specsKey} onChange={e => setForm({...form, specsKey: e.target.value})} />
              <input className="border rounded-lg px-3 py-2 text-sm flex-1" placeholder="Value (e.g. Intel i7)" aria-label="Spec value" value={form.specsVal} onChange={e => setForm({...form, specsVal: e.target.value})} />
              <button type="button" className="bg-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors" onClick={addSpec}>Add</button>
            </div>
            {Object.keys(specs).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(specs).map(([k, v]) => (
                  <span key={k} className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1">
                    {k}: {v}
                    <button type="button" className="text-red-500 ml-1" onClick={() => { const s = {...specs}; delete s[k]; setSpecs(s); }}>&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button className="w-full bg-green-600 text-white rounded-lg py-2 font-medium hover:bg-green-700 transition-colors">Add Product</button>
        </form>
      )}

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Product</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
              <th className="text-right px-4 py-3 font-medium">Price</th>
              <th className="text-right px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 flex items-center gap-3">
                  <img src={p.image} alt={p.name} loading="lazy" className="w-10 h-10 rounded object-contain bg-gray-100" />
                  <span className="truncate max-w-[200px]">{p.name}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-gray-500 capitalize">{p.category}</td>
                <td className="px-4 py-3 text-right font-medium">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-red-500 hover:text-red-700 text-xs font-medium" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-8 text-center text-gray-400">No products.</p>}
      </div>
    </div>
  );
}
