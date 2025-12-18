import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await api.get("/api/accounts/users/me/");
      setUser(res.data);
    } catch (err) {
      // If it's a 403, it just means the customer can't see their full profile
      // via this specific admin-only endpoint. Don't log them out!
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access")) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ CORRECT LOGIN
  // D:\product_api_project\frontend\src\context\AuthContext.jsx

  const login = async (email, password) => {
    try {
      const res = await api.post("/api/token/", { email, password });

      // Store tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // FIX: Use the user object directly from the response
      const userData = res.data.user;
      setUser(userData);

      // Return the role so Login.jsx can redirect
      return userData.role;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
