import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <div className="card flex justify-between items-center mb-4">
      <h1 className="controls">
        <Link to="/admin">Admin Dashboard</Link>
      </h1>

      <div className="controls">
        <span className="small">{user?.email}</span>
        <Link to="/change-password" className="btn secondary">
          Change password
        </Link>
        <button className="btn secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
