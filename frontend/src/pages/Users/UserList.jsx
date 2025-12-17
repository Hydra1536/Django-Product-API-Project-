import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("accounts/users/")
      .then((res) => setUsers(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
