import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CartPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Calculate total
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = totalPrice - discount;

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await axios.get("https://ecombackend-5p7z.onrender.com/api/getprofile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(res.data._id);
    } catch (err) {
      console.error("User fetch error:", err);
      navigate("/login");
    }
  };

  // Fetch Cart
  const fetchCart = async (uid) => {
    try {
      setLoading(true);
      const res = await axios.get(`https://ecombackend-5p7z.onrender.com/api/cart/${uid}`);
      setCartItems(res.data.products || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove item
  const handleRemove = async (productId) => {
    try {
      await axios.post("https://ecombackend-5p7z.onrender.com/api/removefromcart", {
        userId,
        productId,
      });
      fetchCart(userId);
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  // Clear Cart
  const handleClearCart = async () => {
    if (!confirm("Clear all items from cart?")) return;

    try {
      for (const item of cartItems) {
        await axios.post("https://ecombackend-5p7z.onrender.com/api/removefromcart", {
          userId,
          productId: item._id,
        });
      }
      fetchCart(userId);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  // Apply coupon
  const applyCoupon = () => {
    if (coupon === "STYLE10") {
      setDiscount(totalPrice * 0.1);
      alert("Coupon applied! 10% OFF");
    } else {
      alert("Invalid Coupon");
      setDiscount(0);
    }
  };

  // Buy now
  const handleBuyNow = () => {
    localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
    localStorage.setItem("checkoutTotal", finalTotal);
    navigate("/payment");
  };

  // Load on mount
  useEffect(() => {
    if (!token) return navigate("/login");
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) fetchCart(userId);
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] to-[#1A1A25] p-10 pb-32">

      <h1 className="text-4xl font-extrabold mb-8 text-center neon-glow-purple">
        🛒 Your Cart
      </h1>

      {loading ? (
        <p className="text-center text-gray-300">Loading your cart...</p>
      ) : cartItems.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {cartItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="neon-card border border-purple-500/30 bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-52 object-cover"
              />

              <div className="p-5 text-white">
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="text-gray-300">{item.category}</p>

                <p className="text-green-400 font-bold text-lg mt-2">
                  ₹{item.price}
                </p>

                {/* Remove Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleRemove(item._id)}
                  className="mt-4 w-full bg-red-500/80 hover:bg-red-600 text-white py-2 rounded-lg"
                >
                  Remove
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-10 text-lg">
          Your cart is empty 🛍️
        </p>
      )}

      {/* Bottom Checkout Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full neon-footer bg-black/60 backdrop-blur-xl px-6 py-4 border-t border-purple-500/30 flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm">Final Total:</p>
            <h2 className="text-3xl font-extrabold text-purple-400 neon-glow-purple">
              ₹{finalTotal}
            </h2>
          </div>

          <div className="flex items-center gap-4">

            {/* Coupon Input */}
            <input
              className="px-4 py-2 bg-white/20 text-white rounded-xl outline-none border border-purple-500/40"
              placeholder="Coupon code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />

            <button
              onClick={applyCoupon}
              className="px-4 py-2 bg-purple-600/80 hover:bg-purple-700 text-white rounded-xl"
            >
              Apply
            </button>

            <button
              onClick={handleClearCart}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-xl"
            >
              Clear Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="px-8 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-lg font-bold shadow-lg neon-btn"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
