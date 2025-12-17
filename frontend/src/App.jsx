import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductList from "./pages/Products/ProductList";
import UserList from "./pages/Users/UserList";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowRoles={["admin", "staff", "super_staff"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="products" element={<ProductList />} />
          <Route path="users" element={<UserList />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
