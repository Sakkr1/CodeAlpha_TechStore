import { Link } from "react-router-dom";

const CATEGORIES = [
  { name: "Laptops", icon: "💻", desc: "Powerful machines for work and play", slug: "laptops" },
  { name: "Phones", icon: "📱", desc: "Latest flagship smartphones", slug: "phones" },
  { name: "Tablets", icon: "📋", desc: "Versatile productivity tablets", slug: "tablets" },
  { name: "Accessories", icon: "🎧", desc: "Audio, keyboards, and more", slug: "other" },
];

export default function Categories({ onCategoryClick }) {
  const scrollToProducts = (cat) => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    if (onCategoryClick) onCategoryClick(cat);
  };

  return (
    <section id="categories" className="max-w-6xl mx-auto px-4 py-16 md:py-24 scroll-mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => scrollToProducts(cat.slug)}
            className="glass-card p-4 md:p-8 text-center glow-on-hover cursor-pointer group"
          >
            <span className="text-4xl md:text-5xl block mb-4">{cat.icon}</span>
            <h3 className="font-semibold text-base md:text-lg">{cat.name}</h3>
            <p className="text-xs md:text-sm text-gray-400 mt-2">{cat.desc}</p>
            <span className="inline-block mt-4 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Browse &rarr;
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
