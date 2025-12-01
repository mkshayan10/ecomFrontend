import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  HomeIcon,
  UserIcon,
  LogOutIcon,
  CameraIcon,
  ShoppingBagIcon,
  MessageSquareIcon,
  HeartIcon,
  ArrowLeftRightIcon,
  MoonIcon,
  SunIcon,
  ClockIcon,
} from "lucide-react";

export default function UserDashboardV8() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  // Greeting
  const greeting = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning ✨";
    if (hr < 18) return "Good Afternoon 🌞";
    return "Good Evening 🌙";
  }, []);

  // Apply Theme
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("theme", theme);
  }, [theme]);

  //----------------------------------------------------------
  // FETCH PROFILE
  //----------------------------------------------------------
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("https://ecombackend-5p7z.onrender.com/api/getprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        navigate("/login");
      }
    }
    fetchProfile();
  }, []);

  //----------------------------------------------------------
  // FETCH ORDERS
  //----------------------------------------------------------
  useEffect(() => {
    if (!user) return;
    async function fetchOrders() {
      const res = await axios.get(`https://ecombackend-5p7z.onrender.com/api/orders/${user._id}`);
      setOrders(res.data || []);
    }
    fetchOrders();
  }, [user]);

  //----------------------------------------------------------
  // LOGOUT
  //----------------------------------------------------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <div className="text-center mt-20 text-white">Loading...</div>;

  //----------------------------------------------------------
  // REUSABLE STAT CARD
  //----------------------------------------------------------
  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(255,255,255,0.25)" }}
      className={`bg-gradient-to-br ${color} p-[2px] rounded-2xl shadow-lg`}
    >
      <div className="bg-black/80 dark:bg-slate-900 p-6 rounded-2xl h-full flex items-center gap-4">
        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm shadow-md">
          {icon}
        </div>
        <div>
          <p className="text-gray-300 text-sm">{title}</p>
          <p className="text-3xl font-extrabold text-white drop-shadow-xl">{value}</p>
        </div>
      </div>
    </motion.div>
  );

  //----------------------------------------------------------
  // UI
  //----------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f29] via-[#10142f] to-[#0d0f25] text-white flex">

      {/* SIDEBAR */}
      <motion.aside
        animate={{ width: collapsed ? 90 : 260 }}
        className="h-screen sticky top-0 bg-black/40 backdrop-blur-xl border-r border-white/10 shadow-2xl"
      >
        <div className="p-4 flex items-center gap-3">
          <img
            src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            className="w-12 h-12 rounded-full border-2 border-purple-500 shadow-lg"
          />
          {!collapsed && (
            <div className="leading-tight">
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-gray-400 hover:text-white transition"
          >
            <ArrowLeftRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* SIDEBAR MENU */}
        <nav className="p-3 space-y-2">
          <button
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition"
            onClick={() => navigate("/")}
          >
            <HomeIcon className="w-5" />
            {!collapsed && "Home"}
          </button>

          <button
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition"
            onClick={() => navigate("/orders")}
          >
            <ShoppingBagIcon className="w-5" />
            {!collapsed && "My Orders"}
          </button>

          <button
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition"
            onClick={() => navigate("/user")}
          >
            <UserIcon className="w-5" />
            {!collapsed && "Profile"}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-red-500/20 text-red-400 transition"
          >
            <LogOutIcon className="w-5" />
            {!collapsed && "Logout"}
          </button>
        </nav>

        <div className="mt-4 p-4 flex items-center justify-between">
          {!collapsed && <p className="text-xs text-gray-400">Theme</p>}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="bg-white/10 p-2 rounded-xl"
          >
            {theme === "dark" ? <SunIcon className="w-5" /> : <MoonIcon className="w-5" />}
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-gray-400">{greeting}</p>
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
            {user.name}
          </h1>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <StatCard
            title="Orders"
            value={orders.length}
            icon={<ShoppingBagIcon className="w-8 h-8 text-green-300" />}
            color="from-green-500/30 to-green-700/40"
          />

          <StatCard
            title="Wishlist"
            value={user?.stats?.wishlist || 0}
            icon={<HeartIcon className="w-8 h-8 text-pink-300" />}
            color="from-pink-500/30 to-pink-700/40"
          />

          <StatCard
            title="Messages"
            value={user?.stats?.messages || 0}
            icon={<MessageSquareIcon className="w-8 h-8 text-yellow-300" />}
            color="from-yellow-500/30 to-yellow-700/40"
          />
        </div>

        {/* RECENT ORDERS */}
        <div className="mt-12 bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">📦 Recent Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-400">No recent orders.</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((o) => (
                <motion.div
                  key={o._id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-xl bg-white/10 border border-white/10 flex justify-between"
                >
                  <div>
                    <p className="font-medium">Order #{o._id.slice(-6)}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(o.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{o.totalAmount}</p>
                    <span className="px-3 py-1 rounded-full text-xs bg-white/20">
                      {o.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mt-10 text-center text-gray-500 text-sm">
          Premium Neon Dashboard © {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}
