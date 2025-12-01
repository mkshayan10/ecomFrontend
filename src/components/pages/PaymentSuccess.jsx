import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/orders");
    }, 2500);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-green-600">✔ Payment Successful</h1>
        <p className="text-gray-600 mt-2">Redirecting to your orders...</p>
      </div>
    </div>
  );
}
