import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("products/")
      .then((res) => setProducts(res.data.results || res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
