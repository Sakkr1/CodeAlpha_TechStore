import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/api";
import ProductCard from "../components/ProductCard.jsx";
import Hero from "../components/Hero.jsx";
import Categories from "../components/Categories.jsx";
import Features from "../components/Features.jsx";

const CATEGORY_NAMES = { laptops: "Laptops", phones: "Phones", tablets: "Tablets", other: "Accessories" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";

  useEffect(() => {
    api.get("/products")
      .then(({ data }) => setProducts(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allCategories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);

  const setCategory = (cat) => {
    const p = new URLSearchParams(searchParams);
    if (cat) p.set("category", cat);
    else p.delete("category");
    setSearchParams(p);
  };

  const filtered = useMemo(() => {
    let result = products;
    if (categoryFilter) result = result.filter(p => p.category === categoryFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return result;
  }, [products, searchTerm, categoryFilter]);

  const heading = searchTerm
    ? `Results for "${searchTerm}"`
    : categoryFilter
      ? CATEGORY_NAMES[categoryFilter] || categoryFilter
      : "All Products";

  return (
    <>
      <Hero />
      <Categories onCategoryClick={(cat) => {
        const p = new URLSearchParams(searchParams);
        p.set("category", cat);
        setSearchParams(p);
      }} />
      <section id="products" className="max-w-6xl mx-auto px-4 py-16 md:py-24 scroll-mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{heading}</h2>
          {(searchTerm || categoryFilter) && (
            <span className="text-sm text-gray-400">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
          )}
        </div>
        {!searchTerm && allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setCategory("")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                !categoryFilter
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-white/10"
              }`}
            >All</button>
            {allCategories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  categoryFilter === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border-white/10"
                }`}
              >{CATEGORY_NAMES[cat] || cat}</button>
            ))}
          </div>
        )}
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            {searchTerm || categoryFilter ? "No products match your criteria." : "No products yet."}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} priority={i === 0 && !searchTerm && !categoryFilter} />)}
          </div>
        )}
      </section>
      <Features />
    </>
  );
}
