import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OtpVerifyPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("otpEmail");

  if (!email) {
    navigate("/register-email");
  }

  const verifyOtp = async () => {
    try {
      const res = await axios.post("https://ecombackend-5p7z.onrender.com/api/otp", {
        email,
        otp,
      });

      if (res.data === "success") {
        setMessage("🎉 OTP Verified!");

        localStorage.setItem("otpVerified", "true");

        setTimeout(() => navigate("/register"), 1000);
      } else {
        setMessage("❌ Wrong OTP. Try again.");
      }
    } catch (error) {
      setMessage("❌ Failed to verify OTP.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Enter OTP</h1>

        <input
          type="number"
          placeholder="Enter OTP"
          className="border p-3 rounded w-full mb-4"
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verifyOtp}
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Verify OTP
        </button>

        {message && <p className="mt-3 text-center">{message}</p>}
      </div>
    </div>
  );
}
