import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(59,91,255,0.08)] mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-lg font-bold tracking-tight hover:text-blue-400 transition-colors">
              <span className="text-blue-400">TechStore</span>
            </Link>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-xs">
              Premium tech products curated for those who demand the best.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Products</Link></li>
              <li><Link to="/cart" className="hover:text-blue-400 transition-colors">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-blue-400 transition-colors">Wishlist</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="hover:text-blue-400 transition-colors cursor-default">help@techstore.com</span></li>
              <li><span className="hover:text-blue-400 transition-colors cursor-default">1-800-TECH</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[rgba(59,91,255,0.06)] mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} TechStore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
