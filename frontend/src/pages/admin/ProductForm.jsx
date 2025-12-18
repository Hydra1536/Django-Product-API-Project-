import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function ProductForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/api/products/${id}/`).then((res) => setForm(res.data));
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      await api.put(`/api/products/${id}/`, form);
    } else {
      await api.post("/api/products/", form);
    }

    nav("/admin/products");
  };

  return (
    <div className="card max-w-xl mx-auto">
      <h2>{isEdit ? "Edit Product" : "Add Product"}</h2>

      <form onSubmit={submit} className="controls flex-col">
        <input
          className="input"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="input"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="number"
          className="input"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <button className="btn">Save</button>
        <button
          type="button"
          className="btn secondary"
          onClick={() => nav("/admin/products")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
