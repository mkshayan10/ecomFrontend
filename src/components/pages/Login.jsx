import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://ecombackend-5p7z.onrender.com/api/login", {
        email,
        password,
      });

      if (res.status === 200 && res.data.user) {
        const { token, role, name, email, _id, profilePic } = res.data.user;

        // Save login data
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            _id,
            name,
            email,
            role,
            token,
            profilePic: profilePic || "",
          })
        );

        // Save admin separately
        if (role === "admin") {
          localStorage.setItem(
            "admin",
            JSON.stringify({
              _id,
              name,
              email,
              profilePic: profilePic || "",
            })
          );
        }

        alert("Login successful!");

        // REDIRECTION FIX 🎯
        if (role === "admin") {
          navigate("/admin"); // ADMIN GOES TO ADMIN HOME
        } else {
          navigate("/"); // USER GOES TO HOMEPAGE
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#09090F] via-[#1A1A25] to-[#0B0B12] px-4">

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-10 rounded-3xl neon-card bg-white/10 backdrop-blur-xl border border-purple-500/20 shadow-xl"
      >
        <h2 className="text-4xl font-extrabold text-center text-white neon-glow-purple mb-8">
          Login
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #a855f7" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-xl neon-btn shadow-xl"
          >
            Login
          </motion.button>
        </form>

        {/* Register Redirect */}
        <p className="text-center text-gray-300 mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-purple-400 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </motion.div>
    </div>
  );
}
