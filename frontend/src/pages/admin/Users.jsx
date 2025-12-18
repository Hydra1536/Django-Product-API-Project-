import React, { useEffect, useState } from "react";
import { UserService } from "../../services/user.service";
import Pagination from "../../components/common/Pagination";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  // Define admin check for cleaner code
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [page, search]);

  const PAGE_SIZE = 10;

  const load = async () => {
    try {
      const offset = (page - 1) * PAGE_SIZE;

      const res = search
        ? await UserService.search(search)
        : await UserService.list({
            limit: PAGE_SIZE,
            offset,
          });

      // FIX: Check if res.data.results exists (paginated).
      // If not, check if res.data itself is the array (direct search).
      // Otherwise, default to an empty array [].
      const userData =
        res.data.results || (Array.isArray(res.data) ? res.data : []);
      const userCount = res.data.count || userData.length || 0;

      setUsers(userData);
      setCount(userCount);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]); // Clear users on error to prevent crash
      setCount(0);
    }
  };

  const bulkDelete = async () => {
    if (window.confirm("Are you sure you want to delete selected users?")) {
      await UserService.bulkDelete(selected);
      setSelected([]);
      load();
    }
  };

  return (
    <div className="card max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center flex-1">
          <input
            className="input border p-2 rounded"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // ALWAYS reset to page 1 on new search
            }}
          />
        </div>

        <div className="flex gap-2">
          {/* FIX 1: Hide Add User button for non-admins */}
          {isAdmin && (
            <Link
              to="/admin/users/add"
              className="btn bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add User
            </Link>
          )}

          {isAdmin && selected.length > 0 && (
            <button
              className="btn bg-red-600 text-white px-4 py-2 rounded"
              onClick={bulkDelete}
            >
              Delete Selected ({selected.length})
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              {/* FIX 2: Hide "Select" header for non-admins */}
              {isAdmin && <th className="p-3 border-b">Select</th>}

              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b">Staff</th>
              <th className="p-3 border-b">Active</th>

              {/* FIX 3: Hide "Actions" header for non-admins */}
              {isAdmin && <th className="p-3 border-b text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  {/* FIX 4: Hide Checkbox cell for non-admins */}
                  {isAdmin && (
                    <td className="p-3 border-b">
                      <input
                        type="checkbox"
                        checked={selected.includes(u.id)}
                        onChange={(e) =>
                          setSelected((s) =>
                            e.target.checked
                              ? [...s, u.id]
                              : s.filter((i) => i !== u.id),
                          )
                        }
                      />
                    </td>
                  )}

                  <td className="p-3 border-b">{u.username}</td>
                  <td className="p-3 border-b">{u.email}</td>
                  <td className="p-3 border-b capitalize">{u.role}</td>
                  <td className="p-3 border-b">{u.is_staff ? "Yes" : "No"}</td>
                  <td className="p-3 border-b">
                    <span
                      className={
                        u.is_active ? "text-green-600" : "text-red-600"
                      }
                    >
                      {u.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* FIX 5: Hide "Edit" link cell for non-admins */}
                  {isAdmin && (
                    <td className="p-3 border-b text-center">
                      <Link
                        to={`/admin/users/${u.id}/edit`}
                        className="btn secondary"
                      >
                        Edit
                      </Link>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? "7" : "5"}
                  className="p-10 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination page={page} setPage={setPage} count={count} />{" "}
      </div>
    </div>
  );
}
