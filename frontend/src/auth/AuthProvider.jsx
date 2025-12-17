import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { getToken, setTokens, setUser, clearTokens } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("accounts/users/me/")
      .then((res) => {
        setUserState(res.data);
      })
      .catch(() => {
        clearTokens();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async ({ email, password }) => {
  try {
    // CALL EMAIL LOGIN ENDPOINT
    const res = await api.post("accounts/token/", { email, password });
    
    const { access, refresh, user } = res.data;

    // store tokens + user
    setTokens({ access, refresh });
    setUser(user);

    return user; // contains role, id, etc.
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err;
  }
};

  const logout = () => {
    clearTokens();
    setUserState(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
