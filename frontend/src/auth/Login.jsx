import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // D:\product_api_project\frontend\src\auth\Login.jsx

  // D:\product_api_project\frontend\src\auth\Login.jsx

  const submit = async (e) => {
    e.preventDefault();
    try {
      const role = await login(email, password);

      // Identify and redirect based on role
      if (role === "customer") {
        nav("/");
      }
      // else if (role === "admin" || role === "super_staff") {
      //   nav("/admin");
      // }
      else {
        nav("/admin"); // Fallback for other roles
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="container">
      <div className="card max-w-md mx-auto">
        <h2 className="text-xl mb-4">Login</h2>
        <form onSubmit={submit} className="controls flex-col">
          <input
            className="input"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="input"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn">Login</button>
        </form>
      </div>
    </div>
  );
}
