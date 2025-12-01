import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { HomeIcon } from "lucide-react";

export default function OrdersPage() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await axios.get(
        `https://ecombackend-5p7z.onrender.com/api/orders/${user._id}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050009] via-[#120021] to-[#0a0118] p-10">

      {/* ⭐ Floating Neon Home Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => (window.location.href = "/")}
        className="fixed top-6 left-6 z-50 bg-white/10 border border-purple-500/40 backdrop-blur-xl p-4 rounded-2xl neon-card shadow-lg hover:bg-white/20 transition"
      >
        <HomeIcon className="w-7 h-7 text-purple-300 drop-shadow-lg neon-glow-purple" />
      </motion.button>

      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-center neon-glow-purple mb-12"
      >
        📦 Your Orders
      </motion.h1>

      {orders.length === 0 ? (
        <p className="text-gray-300 text-center text-lg">No orders found.</p>
      ) : (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {orders.map((o, idx) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-purple-500/30 shadow-lg neon-card"
            >
              <h2 className="font-bold text-2xl text-white mb-2">
                Order #{o._id.substring(0, 6)}
              </h2>

              <div className="mt-4 space-y-4">
                {o.products.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center bg-white/5 border border-purple-500/20 rounded-xl p-4"
                  >
                    <div>
                      <p className="text-white text-lg">{item.name}</p>
                      <p className="text-green-400 font-semibold">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <p className="text-xl font-bold text-purple-300">
                  Total: ₹{o.totalAmount}
                </p>

                <span
                  className={`px-5 py-2 rounded-full text-sm font-semibold border ${
                    o.status === "Delivered"
                      ? "bg-green-500/20 border-green-500 text-green-300"
                      : o.status === "Pending"
                      ? "bg-yellow-500/20 border-yellow-500 text-yellow-300"
                      : "bg-gray-500/20 border-gray-500 text-gray-300"
                  }`}
                >
                  {o.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
