import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("https://ecombackend-5p7z.onrender.com/api/register", {
        name,
        email,
        password,
        role,
      });

      setMessage("🎉 Registration Successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0118] via-[#120021] to-[#050009] px-4">
      <motion.div
        initial={{ opacity: 0, y: 45 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-10 rounded-3xl bg-white/10 border border-purple-500/20 backdrop-blur-xl neon-card shadow-xl"
      >
        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          Create Account
        </h2>

        {message && (
          <p className="text-center text-purple-300 text-sm mb-4">{message}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full px-3 py-3 rounded-xl bg-white/5 border border-purple-500/30 text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user" className="text-black">User</option>
            <option value="admin" className="text-black">Admin</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-md"
          >
            Register
          </motion.button>
        </form>

        <p className="text-center text-gray-300 mt-6 text-sm">
          Already have an account?{" "}
          <span
            className="text-purple-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}
