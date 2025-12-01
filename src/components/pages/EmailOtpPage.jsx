import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EmailOtpPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    setMessage("");

    try {
      await axios.post("https://ecombackend-5p7z.onrender.com/api/email", { email });

      // store the email for the next step
      localStorage.setItem("otpEmail", email);

      setMessage("✅ OTP sent to your email!");
      setTimeout(() => navigate("/verify-otp"), 1200);
    } catch (error) {
      if (error.response?.status === 400) {
        setMessage("❌ Email already registered. Try Login.");
      } else {
        setMessage("❌ Failed to send OTP. Try again.");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Register - Step 1</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="border p-3 rounded w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Send OTP
        </button>

        {message && (
          <p className="mt-3 text-center text-sm">{message}</p>
        )}
      </div>
    </div>
  );
}
