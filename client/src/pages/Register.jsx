import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      toast.success("Registered");
      nav("/");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Name" aria-label="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Email" aria-label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Password" aria-label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors">Register</button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-500">Have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
    </div>
  );
}
