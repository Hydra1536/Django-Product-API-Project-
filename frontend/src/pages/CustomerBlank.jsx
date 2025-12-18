import React from "react";
import { Link } from "react-router-dom";

export default function CustomerBlank() {
  return (
    <div className="container">
      <div className="card text-center">
        <h2>Welcome</h2>
        <p className="small mb-4">Welcome as a customer!!!</p>

        <Link to="/login" className="btn">
          Login
        </Link>
      </div>
    </div>
  );
}
