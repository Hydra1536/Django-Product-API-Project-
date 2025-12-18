import React from "react";
export default function ProductTable({ products, selected, setSelected }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th />
          <th>ID</th>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
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
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>${p.price}</td>
            <td>{p.category}</td>
            <td>{p.created_at}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
