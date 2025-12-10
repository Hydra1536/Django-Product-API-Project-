import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "../api";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 500);
    return () => clearTimeout(t);
  }, [q]);

  const buildParams = useCallback(() => {
    const params = { limit, offset };

    if (debouncedQ) params.search = debouncedQ;
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!Number.isNaN(min)) params["price__gte"] = min;
    if (!Number.isNaN(max)) params["price__lte"] = max;
    if (ordering) params.ordering = ordering;
    return params;
  }, [limit, offset, debouncedQ, minPrice, maxPrice, ordering]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildParams();
      const res = await api.get("/api/products/", { params });
      const data = res.data;
      setProducts(data.results ?? data);
      setCount(data.count ?? 0);
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, offset, debouncedQ, minPrice, maxPrice, ordering]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}/`);
      fetchProducts();
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed");
    }
  };

  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

const handleBulkDelete = async () => {
  if (selected.length === 0) return alert("No items selected");
  if (!window.confirm(`Delete ${selected.length} items?`)) return;

  try {
    await api.delete("/api/products/bulk_delete/", {
      data: { ids: selected }, // DELETE must pass data like this
    });
    setSelected([]);
    fetchProducts();
  } catch (e) {
    console.error("Bulk delete failed:", e);
    alert("Bulk delete failed");
  }
};


  const totalPages = Math.max(1, Math.ceil(count / limit));
  const currentPage = Math.floor(offset / limit) + 1;

  const goToPage = (page) => setOffset(Math.max(0, (page - 1) * limit));

  const clearFilters = () => {
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    setOrdering("-created_at");
    setOffset(0);
    setSelected([]);
  };

  const formatPrice = (p) =>
    p == null
      ? "-"
      : Number(p).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  // ✨ Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const staggerContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      className="container p-6 min-h-screen text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      >


        <div cellspacing="10" className="flex gap-4 mt-4 md:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
          >
            <Link
              to="/products/new"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
            >
              ➕ Add Product
            </Link>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBulkDelete}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
          >
            🗑️ Bulk Delete ({selected.length})
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
          >
            Reset
          </motion.button>
        </div>
      </motion.div>
      <br></br>

      {/* Filters Card */}
      <motion.div
        className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-white/20"
        whileHover={{ scale: 1.01, boxShadow: "0px 8px 25px rgba(0,0,0,0.3)" }}
        variants={fadeInUp}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[ // filter inputs
            { placeholder: "Search products…", value: q, set: setQ, type: "text" },
            { placeholder: "Min price", value: minPrice, set: setMinPrice, type: "number" },
            { placeholder: "Max price", value: maxPrice, set: setMaxPrice, type: "number" },
          ].map((f, i) => (
            <input
              key={i}
              type={f.type}
              placeholder={f.placeholder}
              value={f.value}
              onChange={(e) => {
                f.set(e.target.value);
                setOffset(0);
              }}
              className="rounded-lg px-4 py-2 bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-emerald-400 outline-none transition"
            />
          ))}

          <select
            value={ordering}
            onChange={(e) => {
              setOrdering(e.target.value);
              setOffset(0);
            }}
            className="rounded-lg px-4 py-2 bg-white/20 border border-white/30 text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
          >
            <option value="-created_at">Newest</option>
            <option value="created_at">Oldest</option>
            <option value="-price">Price High → Low</option>
            <option value="price">Price Low → High</option>
            <option value="name">Name A → Z</option>
            <option value="-name">Name Z → A</option>
          </select>
        </div>
      </motion.div>
<br></br>
      {/* Table */}
      <motion.div
      cellspacing="10"
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-x-auto"
        whileHover={{ scale: 1.01 }}
      >
        {loading ? (
          <div className="p-10 text-center text-gray-200 text-lg">Loading…</div>
        ) : products.length === 0 ? (
          <div className="p-10 text-center text-gray-300 text-lg">
            No products found
          </div>
        ) : (
          <motion.table 
          width="100%"
          cellspacing="30"
            className="min-w-full divide-y divide-white/20 text-white"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <thead className="bg-white/5">
              <tr>
                {["#", "Name", "Category", "Price", "Created at", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody  className="divide-y divide-white/10">
              {products.map((p, idx) => (
                <motion.tr
                  key={p.id}
                  variants={fadeInUp}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "rgba(239, 11, 11, 0.1)",
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 12 }}
                >
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {offset + idx + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {p.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {p.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-emerald-400 text-right font-semibold">
                    ${formatPrice(p.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {new Date(p.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleSelect(p.id)}
                        className={`px-3 py-1 rounded-md text-sm transition ${
                          selected.includes(p.id)
                            ? "bg-yellow-400 text-black"
                            : "bg-white/20 hover:bg-white/30"
                        }`}
                      >
                        {selected.includes(p.id) ? "Selected" : "Select"}
                      </motion.button>

                      
                                                <Link
                        to={`/products/${p.id}/edit`}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition"
                      ><motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}>
                        Edit</motion.button>
                      </Link>
                        


                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        )}
      </motion.div>

      {/* Pagination */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        className="mt-8 flex justify-between items-center text-white"
      >
        <br></br>
        <div className="flex gap-2">
          {["First", "Prev", "Next", "Last"].map((label, i) => {
            const isDisabled =
              (label === "First" || label === "Prev") && currentPage === 1
                ? true
                : (label === "Next" || label === "Last") &&
                  currentPage === totalPages;
            const onClick =
              label === "First"
                ? () => goToPage(1)
                : label === "Prev"
                ? () => goToPage(currentPage - 1)
                : label === "Next"
                ? () => goToPage(currentPage + 1)
                : () => goToPage(totalPages);
            return (
              <motion.button
                key={label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                disabled={isDisabled}
                className={`px-4 py-2 border border-white/30 rounded-lg text-sm backdrop-blur-sm ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/20 transition"
                }`}
              >
                {label}
              </motion.button>
            );
          })}
        </div>
        <div className="text-sm text-gray-200 font-medium">
          <br></br>Page {currentPage} of {totalPages}
        </div>
      </motion.div>
    </motion.div>
  );
}
