import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
  const total = localStorage.getItem("checkoutTotal") || 0;

  const [userId, setUserId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await axios.get("https://ecombackend-5p7z.onrender.com/api/getprofile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(res.data._id);
    } catch (err) {
      console.error("User fetch failed:", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchUser();
  }, []);

  // Handle Payment
  const handlePayment = async () => {
    if (!userId) return navigate("/login");
    setProcessing(true);

    setTimeout(async () => {
      try {
        const res = await axios.post("https://ecombackend-5p7z.onrender.com/api/placeorder", {
          userId,
        });

        if (res.status === 201 || res.status === 200) {
          localStorage.removeItem("checkoutItems");
          localStorage.removeItem("checkoutTotal");
          navigate("/payment-success");
        }
      } catch (err) {
        console.error("Payment error:", err);
        alert("Payment failed.");
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050009] via-[#120021] to-[#0a0118] flex flex-col items-center py-14 px-6">

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold neon-glow-purple mb-12 text-center"
      >
        💳 Payment Gateway
      </motion.h1>

      {/* Payment Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white/10 border border-purple-500/30 backdrop-blur-2xl p-8 rounded-3xl neon-card shadow-xl"
      >
        <h2 className="text-2xl text-white font-semibold mb-6">
          Select Payment Method
        </h2>

        {/* Payment Options */}
        <div className="space-y-4 text-white">
          {[
            { id: "card", label: "Credit / Debit Card" },
            { id: "upi", label: "UPI (Google Pay / PhonePe)" },
            { id: "cod", label: "Cash on Delivery" },
          ].map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-purple-500/30 bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              <input
                type="radio"
                className="scale-125 accent-purple-500"
                checked={paymentMethod === option.id}
                onChange={() => setPaymentMethod(option.id)}
              />
              <span className="text-lg">{option.label}</span>
            </label>
          ))}
        </div>

        {/* Total Section */}
        <div className="mt-8 border-t border-purple-500/20 pt-5">
          <p className="text-gray-300 text-sm">Total Amount</p>
          <h2 className="text-4xl font-bold text-green-400 neon-glow-purple">
            ₹{total}
          </h2>
        </div>

        {/* Pay Button */}
        <motion.button
          onClick={handlePayment}
          disabled={processing}
          whileHover={{ scale: processing ? 1 : 1.05 }}
          whileTap={{ scale: processing ? 1 : 0.95 }}
          className={`w-full mt-8 py-4 rounded-xl text-white text-lg font-bold neon-btn ${
            processing
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90"
          }`}
        >
          {processing ? "Processing Payment..." : "Pay Now"}
        </motion.button>
      </motion.div>
    </div>
  );
}
