import React, { useEffect, useState } from "react";
import { ProductService } from "../../services/product.service";
import Pagination from "../../components/common/Pagination";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Products() {
  const { user } = useAuth();
  // Authorization check
  const canEdit = ["admin", "super_staff"].includes(user?.role);

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("");

  useEffect(() => {
    loadProducts();
  }, [page, search, minPrice, maxPrice, ordering]);

  const PAGE_SIZE = 10;

  const loadProducts = async () => {
    const offset = (page - 1) * PAGE_SIZE;

    const res = await ProductService.list({
      limit: PAGE_SIZE,
      offset,
      search: search || undefined,
      price__gte: minPrice || undefined,
      price__lte: maxPrice || undefined,
      ordering: ordering || undefined,
    });

    setProducts(res.data.results);
    setCount(res.data.count);
  };

  const bulkDelete = async () => {
    if (window.confirm("Delete selected items?")) {
      await ProductService.bulkDelete(selected);
      setSelected([]);
      loadProducts();
    }
  };

  return (
    <div className="card">
      <h2>Products</h2>

      <div className="controls flex-wrap mb-3">
        {/* Only show "Add Product" to authorized users */}
        {canEdit && (
          <Link to="/admin/products/add" className="btn mb-3">
            Add product
          </Link>
        )}

        <input
          className="input"
          placeholder="Search"
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <input
          className="input"
          placeholder="Min price"
          type="number"
          onChange={(e) => {
            setPage(1);
            setMinPrice(e.target.value);
          }}
        />
        <input
          className="input"
          placeholder="Max price"
          type="number"
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select className="input" onChange={(e) => setOrdering(e.target.value)}>
          <option value="">Default</option>
          <option value="name">Name A–Z</option>
          <option value="-name">Name Z–A</option>
          <option value="price">Price low → high</option>
          <option value="-price">Price high → low</option>
          <option value="created_at">Oldest</option>
          <option value="-created_at">Newest</option>
        </select>
      </div>

      {canEdit && selected.length > 0 && (
        <button className="btn danger mb-3" onClick={bulkDelete}>
          Delete selected ({selected.length})
        </button>
      )}

      <table className="table">
        <thead>
          <tr>
            {/* CONDITIONAL HEADER */}
            {canEdit && <th>Select</th>}
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Created</th>
            {/* CONDITIONAL HEADER */}
            {canEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              {/* CONDITIONAL CELL */}
              {canEdit && (
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={(e) =>
                      setSelected((s) =>
                        e.target.checked
                          ? [...s, p.id]
                          : s.filter((id) => id !== p.id),
                      )
                    }
                  />
                </td>
              )}
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.category}</td>
              <td>{new Date(p.created_at).toLocaleDateString()}</td>

              {/* CONDITIONAL CELL */}
              {canEdit && (
                <td>
                  <Link
                    to={`/admin/products/${p.id}/edit`}
                    className="btn secondary"
                  >
                    Edit
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination page={page} setPage={setPage} count={count} />
    </div>
  );
}
