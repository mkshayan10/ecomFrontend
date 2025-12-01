import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBagIcon,
  UserIcon,
  LogInIcon,
  HeartIcon,
  LogOutIcon,
  ShoppingCartIcon,
} from "lucide-react";

import { motion } from "framer-motion";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // Load User Data
  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setLoggedInUser(JSON.parse(stored));
  }, []);

  // Fetch Products
  useEffect(() => {
    axios
      .get("https://ecombackend-5p7z.onrender.com/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Add To Cart
  const addToCart = async (productId) => {
    if (!loggedInUser) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      await axios.post("https://ecombackend-5p7z.onrender.com/api/addtocart", {
        userId: loggedInUser._id,
        productId,
      });

      setCartCount((prev) => prev + 1);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart.");
    }
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    setLoggedInUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#090A1A] text-white flex flex-col">

      {/* 🟣 NEON PREMIUM NAVBAR */}
      <motion.header
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="fixed w-full z-50 bg-black/40 backdrop-blur-xl border-b border-purple-500/40 shadow-[0_0_20px_rgba(150,0,255,0.4)]"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <motion.h1
            whileHover={{ scale: 1.1 }}
            className="text-3xl font-extrabold tracking-wide cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="text-purple-400 drop-shadow-[0_0_10px_#A855F7]">Style</span>
            <span className="text-pink-400 drop-shadow-[0_0_10px_#EC4899]">Store</span>
          </motion.h1>

          {/* SEARCH BAR */}
          <div className="hidden md:flex items-center w-96 bg-black/30 py-2 px-4 rounded-xl border border-purple-500/40 shadow-[0_0_10px_rgba(150,0,255,0.4)]">
            <input
              type="text"
              placeholder="Search your vibe..."
              className="w-full bg-transparent text-white placeholder-gray-300 outline-none"
            />
          </div>

          {/* RIGHT SIDE OPTIONS */}
          <div className="flex items-center gap-8">

            {/* CART ICON */}
            <motion.div
              whileHover={{ rotate: -10, scale: 1.2 }}
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <ShoppingCartIcon className="w-6 h-6 text-purple-300 drop-shadow-[0_0_8px_#A855F7]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg">
                  {cartCount}
                </span>
              )}
            </motion.div>

            {/* USER DROPDOWN */}
            {loggedInUser ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={loggedInUser.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    className="w-10 h-10 rounded-full border border-purple-500 shadow-[0_0_10px_#A855F7]"
                  />
                  <span className="font-semibold">{loggedInUser.name}</span>
                </div>

                <div className="absolute right-0 mt-3 w-52 bg-black/80 border border-purple-500/40 backdrop-blur-md shadow-xl rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button
                    className="w-full text-left py-2 hover:bg-purple-700/40 rounded-lg"
                    onClick={() => navigate(loggedInUser.role === "admin" ? "/admin" : "/user")}
                  >
                    Dashboard
                  </button>

                  <button
                    className="w-full text-left py-2 hover:bg-purple-700/40 rounded-lg"
                    onClick={() => navigate("/orders")}
                  >
                    My Orders
                  </button>

                  <button
                    className="w-full text-left py-2 text-red-400 hover:bg-red-800/40 rounded-lg"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-purple-300 hover:text-purple-400 transition font-medium"
                >
                  Login
                </button>

                <motion.button
                  whileHover={{ scale: 1.07 }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-[0_0_15px_#A855F7]"
                  onClick={() => navigate("/register")}
                >
                  Register
                </motion.button>
              </div>
            )}

          </div>
        </div>
      </motion.header>

    {/* 🟣 MINIMAL PREMIUM HERO SECTION */}
<section className="relative mt-20 py-40 bg-[#0B0D1F] overflow-hidden">

  {/* Neon Background Glows */}
  <div className="pointer-events-none select-none">
    <div className="absolute top-20 left-0 w-72 h-72 bg-purple-600/30 blur-3xl rounded-full animate-pulse"></div>
    <div className="absolute bottom-10 right-0 w-96 h-96 bg-pink-600/20 blur-3xl rounded-full animate-pulse"></div>
  </div>

  <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
    {/* Main Heading */}
    <motion.h2
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="text-6xl font-extrabold text-white drop-shadow-[0_0_25px_#A855F7]"
    >
      Elevate Your Style
    </motion.h2>

    {/* Subtext */}
    <motion.p
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-5 text-lg text-purple-200 max-w-xl mx-auto"
    >
      Discover premium fashion. Neon inspired. Designed for the bold.
    </motion.p>

    {/* Only Shop Now Button */}
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate("/products")}
      className="mt-8 px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xl font-bold rounded-xl shadow-[0_0_30px_#A855F7] hover:opacity-90 transition"
    >
      Shop Now
    </motion.button>
  </div>
</section>



      {/* 🟣 FEATURED PRODUCTS */}
      <section className="py-20 px-6 bg-[#0D0F21]">
        <h3 className="text-4xl font-extrabold text-center mb-12">
          <span className="text-purple-400 drop-shadow-[0_0_8px_#A855F7]">Featured</span>{" "}
          <span className="text-pink-400 drop-shadow-[0_0_8px_#EC4899]">Products</span>
        </h3>

        {/* Only 4 Products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {products.slice(0, 4).map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              whileHover={{ scale: 1.08 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-[0_0_20px_rgba(150,0,255,0.35)] border border-purple-500/40 overflow-hidden"
            >
              <img
                src={product.image}
                className="w-full h-60 object-cover"
              />

              <div className="p-5 text-center">
                <h4 className="text-xl font-semibold">{product.name}</h4>
                <p className="text-purple-300 text-2xl font-bold mt-2">
                  ₹{product.price}
                </p>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg shadow-[0_0_12px_#A855F7]"
                  onClick={() => addToCart(product._id)}
                >
                  <ShoppingBagIcon className="inline w-4 h-4 mr-2" />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* VIEW ALL */}
        <div className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="px-10 py-3 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-[0_0_12px_#6366F1]"
            onClick={() => navigate("/products")}
          >
            View All Products
          </motion.button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-gray-400 text-center bg-black/40 border-t border-purple-500/30">
        Neon UI © {new Date().getFullYear()} — StyleStore Premium Edition
      </footer>
    </div>
  );
}
