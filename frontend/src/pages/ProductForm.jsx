import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function ProductForm() {
const { id } = useParams();
const [name, setName] = useState("");
const [price, setPrice] = useState("");
const [category, setCategory] = useState("");
const [errors, setErrors] = useState({});
const navigate = useNavigate();

useEffect(() => {
  if (!id) return;
  (async () => {
    try {
      // Use actual backticks ` here for template literals
      const res = await api.get(`/api/products/${id}/`);
      setName(res.data.name || "");
      setPrice(res.data.price || "");
      setCategory(res.data.category || "");
    } catch (e) {
      console.error(e);
    }
  })();
}, [id]);

const handleSubmit = async (e) => {
e.preventDefault();
setErrors({});

const payload = {
  name,
  price: price !== "" ? Number(price) : "",
  category,
};

try {
  if (id) {
    await api.put(`/api/products/${id}/`, payload);
  } else {
    await api.post("/api/products/", payload);
  }
  navigate("/products");
} catch (err) {
  if (err.response?.data) setErrors(err.response.data);
}


};

return (
<div align="center" className="container py-10">
  <br></br><br />
<div className="card p-8 max-w-2xl mx-auto">
  <div className="flex justify-between items-center mb-6">

    <div className="flex justify-between items-center mb-6">
      <div><br></br>
        <h2 grid grid-cols-1 gap-5className="text-3xl font-bold text-gray-800">
          {id ? "Edit Product" : "Create Product"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {id ? "Update product details" : "Fill product information"}
        </p>
      </div>
    </div><br></br>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">

      <div >
        <label className="text-sm text-gray-600 mb-1 block">Product Name </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Enter product name"
        />
        {errors.name && (
          <div className="text-red-600 text-sm mt-1">{errors.name}</div>
        )}
      </div><br></br>

      <div>
        <label className="text-sm text-gray-600 mb-1 block">Price (USD) </label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input"
          placeholder="Enter price"
        />
        {errors.price && (
          <div className="text-red-600 text-sm mt-1">{errors.price}</div>
        )}
      </div><br></br>

      <div>
        <label className="text-sm text-gray-600 mb-1 block">Category </label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
          placeholder="Enter category"
        />
        {errors.category && (
          <div className="text-red-600 text-sm mt-1">{errors.category}</div>
        )}
      </div>
<br></br>
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow"
        >
          {id ? "Save Changes" : "Create Product"}
        </button>
      </div><br></br>

    </form>
  </div>
</div>
</div>

);
}