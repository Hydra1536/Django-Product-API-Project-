import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginPage from "./pages/Login";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./AuthContext";

function NavBar() {
  const { user, logout } = useAuth();
  if (!user?.isAuthenticated) return null;

  return (
    
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 70 }}
      className="w-full bg-gray-800 shadow-md sticky top-0 z-40"
    >
      <div className="container flex items-center justify-between py-3">
        <div align="left"><h1>
  <Link
    to="/products"
    className="text-white text-lg font-semibold tracking-wide hover:text-emerald-400 transition **no-underline**"
  >
    Product Dashboard
  </Link>
</h1></div>

        <div align="right"><button 
          onClick={logout}
          className="px-4 py-1.5 rounded-md bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium hover:scale-105 transition"
        >
          Logout
        </button></div>
      </div>
    </motion.nav>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedAppContent />
    </Router>
  );
}

function AnimatedAppContent() {
  const location = useLocation();
  const onLoginPage = location.pathname === "/login";

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 -z-10">
  <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]" />
  <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px]" />
</div>

      {!onLoginPage && <NavBar />}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={onLoginPage ? "" : "py-8 px-4 sm:px-6 lg:px-8"}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/new"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
