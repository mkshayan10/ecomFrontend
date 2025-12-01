import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/login";
import Register from "./components/pages/Register";
import AdminDashboard from "./components/pages/AdminDashboard";
import UserDashboard from "./components/pages/UserDashboard";
import HomePage from "./components/pages/HomePage";
import AddProduct from "./components/pages/AddProduct";
import ProductsPage from "./components/pages/ProductsPage";
import CartPage from "./components/pages/CartPage";
import OtpPage from "./components/pages/OtpPage";
import EmailOtpPage from "./components/pages/EmailOtpPage";
import OtpVerifyPage from "./components/pages/OtpVerifyPage";
import ProtectedRoute from "./components/pages/ProtectedRoute";
import PaymentSuccess from "./components/pages/PaymentSuccess";
import PaymentPage from "./components/pages/PaymentPage";
import OrdersPage from "./components/pages/OrdersPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard */}
        <Route path="/user" element={<UserDashboard />} />

        {/* Protected Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roleRequired="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Product Related */}
        <Route path="/addproduct" element={<AddProduct />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Orders */}
        <Route path="/orders" element={<OrdersPage />} />

        {/* OTP Flow
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/register-email" element={<EmailOtpPage />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} /> */}

        {/* Payment */}
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
