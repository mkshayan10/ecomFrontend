import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function OtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");

  // ---------- Send OTP ----------
  const sendOtp = async () => {
    setMessage("");

    try {
      await axios.post("https://ecombackend-5p7z.onrender.com/api/email", { email });

      setMessage("✅ OTP sent to your email!");
      setStep("otp");
    } catch (error) {
      if (error.response?.status === 400) {
        setMessage("❌ Email already registered. Please login.");
      } else {
        setMessage("❌ Failed to send OTP. Try again.");
      }
    }
  };

  // ---------- Verify OTP ----------
  const verifyOtp = async () => {
    setMessage("");

    try {
      const res = await axios.post("https://ecombackend-5p7z.onrender.com/api/otp", {
        email,
        otp,
      });

      if (res.data === "success") {
        setMessage("🎉 OTP Verified! Continue to Registration.");
      } else {
        setMessage("❌ Invalid OTP. Try again.");
      }
    } catch (error) {
      setMessage("❌ OTP verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#09090F] via-[#1A1A25] to-[#0B0B12] px-4">

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-10 rounded-3xl neon-card bg-white/10 backdrop-blur-xl border border-purple-500/20 shadow-xl"
      >
        <h1 className="text-3xl font-extrabold text-center text-white neon-glow-purple mb-6">
          Email Verification
        </h1>

        {/* EMAIL STEP */}
        {step === "email" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px #a855f7" }}
              whileTap={{ scale: 0.9 }}
              onClick={sendOtp}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 rounded-xl neon-btn"
            >
              Send OTP
            </motion.button>
          </motion.div>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <input
              type="number"
              placeholder="Enter OTP"
              className="w-full px-4 py-3 bg-white/5 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px #22c55e" }}
              whileTap={{ scale: 0.9 }}
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition neon-btn"
            >
              Verify OTP
            </motion.button>

            <button
              className="w-full text-purple-400 hover:underline text-sm mt-1"
              onClick={() => setStep("email")}
            >
              ← Change Email
            </button>
          </motion.div>
        )}

        {/* MESSAGE */}
        {message && (
          <p className="text-center mt-6 text-purple-300 font-medium">
            {message}
          </p>
        )}
      </motion.div>
    </div>
  );
}
