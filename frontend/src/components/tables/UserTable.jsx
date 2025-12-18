import React from "react";
export default function UserTable({ users, selected, setSelected }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th />
          <th>Email</th>
          <th>Role</th>
          <th>Staff</th>
          <th>Active</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={(e) =>
                  setSelected((s) =>
                    e.target.checked
                      ? [...s, u.id]
                      : s.filter((id) => id !== u.id),
                  )
                }
              />
            </td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.is_staff ? "Yes" : "No"}</td>
            <td>{u.is_active ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
