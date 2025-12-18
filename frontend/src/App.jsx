import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import UserForm from "./pages/admin/UserForm";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import ChangePassword from "./pages/ChangePassword";
import CustomerBlank from "./pages/CustomerBlank";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />

          {/* Customer */}
          <Route path="/" element={<CustomerBlank />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin", "staff", "super_staff"]}>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute roles={["admin", "staff", "super_staff"]}>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users/add"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout>
                  <UserForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute roles={["admin", "staff", "super_staff"]}>
                <AdminLayout>
                  <Products />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products/add"
            element={
              <ProtectedRoute roles={["admin", "super_staff"]}>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:id/edit"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminLayout>
                  <UserForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <ProtectedRoute roles={["admin", "super_staff"]}>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
