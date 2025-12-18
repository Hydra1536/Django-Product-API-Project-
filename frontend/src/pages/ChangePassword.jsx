import api from "../services/api";
import { useState } from "react";
import React from "react";
import Header from "../components/layout/Header";

export default function ChangePassword() {
  const [old, setOld] = useState("");
  const [next, setNext] = useState("");

  const submit = async () => {
    await api.post("/api/accounts/users/change_my_password/", {
      old_password: old,
      new_password: next,
    });
    alert("Password changed");
  };

  return (
    <div>
      <Header />
      <div className="card max-w-md">
        <h2>Change password</h2>
        <input
          className="input"
          placeholder="Old password"
          type="password"
          onChange={(e) => setOld(e.target.value)}
        />
        <input
          className="input mt-2"
          placeholder="New password"
          type="password"
          onChange={(e) => setNext(e.target.value)}
        />
        <button className="btn mt-4" onClick={submit}>
          Save
        </button>
      </div>
    </div>
  );
}
