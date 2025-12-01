import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    axios
      .get("https://ecombackend-5p7z.onrender.com/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Please log in first!");
      return;
    }

    try {
      const res = await axios.post("https://ecombackend-5p7z.onrender.com/api/addtocart", {
        userId: user._id,
        productId,
      });
      alert("Added to Cart!");
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09090F] via-[#1A1A25] to-[#0B0B12] py-20 px-6">

      <h1 className="text-5xl font-extrabold text-center neon-glow-purple mb-16">
        🛍 All Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {products.map((p, index) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ scale: 1.06 }}
              className="neon-card bg-white/10 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-lg overflow-hidden"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-60 w-full object-cover"
              />

              <div className="p-5">
                <h2 className="text-2xl font-bold text-white">{p.name}</h2>
                <p className="text-gray-300 mt-1 capitalize">{p.category}</p>

                <p className="text-purple-300 font-bold text-xl mt-3">
                  ₹{p.price}
                </p>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleAddToCart(p._id)}
                  className="mt-5 w-full neon-btn bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-xl font-semibold shadow-md hover:opacity-90"
                >
                  Add to Cart 🛒
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
