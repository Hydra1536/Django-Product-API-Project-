import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setTokens } from "../utils/auth";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/accounts/token/",
        { email, password }
      );

      const { access, refresh, user } = res.data;

      setTokens({ access, refresh });
      login(user);

      // ROLE-BASED REDIRECT
      if (user.role === "customer") {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
