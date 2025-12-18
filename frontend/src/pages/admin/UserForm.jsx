import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function UserForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    username: "", // Changed from "name" to "username" to match your API
    email: "",
    password: "",
    role: "customer",
    // is_active: true,
    // is_staff: false,
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/api/accounts/users/${id}/`).then((res) => setForm(res.data));
    }
  }, [id, isEdit]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/api/accounts/users/${id}/`, form);
      } else {
        await api.post("/api/accounts/users/", form);
      }
      nav("/admin/users");
    } catch (error) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert("A user with this email or username already exists.");
    }
  };

  return (
    <div className="card max-w-xl mx-auto">
      <h2>{isEdit ? "Edit User" : "Add User"}</h2>

      <form onSubmit={submit} className="controls flex-col">
        {/* Changed value and onChange to username */}
        <input
          className="input"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Corrected Conditional Rendering for Password */}
        {!isEdit && (
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        )}

        <select
          className="input"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="super_staff">Super Staff</option>
          <option value="admin">Admin</option>
        </select>

        {/* <select
          className="input"
          value={form.is_active}
          onChange={(e) =>
            setForm({ ...form, is_active: e.target.value === "true" })
          }
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select> */}

        <button className="btn" type="submit">
          {isEdit ? "Update User" : "Create User"}
        </button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => nav("/admin/users")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
