export default function Hero() {
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 md:pt-32 md:pb-24 text-center">
      <div className="absolute top-10 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-[120px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-60 h-60 md:w-80 md:h-80 bg-purple-500/15 rounded-full blur-[100px] animate-float-slower pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
          Premium Tech{" "}
          <span className="text-blue-400">Delivered</span>
        </h1>
        <p className="mt-6 text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Discover the latest laptops, phones, tablets, and accessories. Curated for those who demand the best.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <a
            href="#products"
            onClick={scrollTo("products")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full font-semibold glow-button text-sm"
          >
            Shop Now
          </a>
          <a
            href="#categories"
            onClick={scrollTo("categories")}
            className="border border-white/10 text-white/80 px-8 py-3.5 rounded-full font-semibold hover:bg-white/5 hover:text-white transition-all duration-300 hover:-translate-y-0.5 text-sm"
          >
            Explore Categories
          </a>
        </div>
      </div>
    </section>
  );
}
