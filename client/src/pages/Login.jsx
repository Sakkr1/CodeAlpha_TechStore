import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in");
      nav("/");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 px-4">
      <div className="glass-card p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all" placeholder="Email" aria-label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-all" placeholder="Password" aria-label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-medium glow-button">Login</button>
        </form>
        <p className="text-sm text-center mt-5 text-gray-500">No account? <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Register</Link></p>
      </div>
    </div>
  );
}
