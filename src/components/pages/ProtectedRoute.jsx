// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roleRequired = "admin" }) {
  try {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token) return <Navigate to="/login" replace />;

    if (roleRequired && role !== roleRequired) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}
