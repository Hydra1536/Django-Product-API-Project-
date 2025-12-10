import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState(null);
const { login } = useAuth();
const navigate = useNavigate();

const handleSubmit = async (e) => {
e.preventDefault();
setError(null);

try {
  await login(username, password);
  navigate("/products");
} catch (err) {
  setError("Invalid credentials");
}


};

return (<h2 valign="center" align ="center" >
  <br></br><br></br><br/><br />
<div align="center" valign="bottom" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-4">
<div className="w-full max-w-md bg-white shadow-xl rounded-xl p-10 border border-gray-100">

    <div className="text-center mb-6">

      <h2 className="text-3xl font-bold mt-4 text-gray-800 tracking-tight">
        Welcome Back
      </h2>
      <p className="text-gray-500 text-sm mt-1">Admin Panel Login</p>
    </div>

    {error && (
      <div className="text-red-600 bg-red-50 border border-red-200 rounded p-2 text-sm mb-4">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="text-sm text-gray-600 mb-1 block">Username </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input"
          placeholder="Enter username"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600 mb-1 block">Password </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Enter password"
        />
      </div>
<br></br>
      <button className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md shadow font-medium">
        Login
      </button>

    </form>

  </div>
</div></h2>


);
}