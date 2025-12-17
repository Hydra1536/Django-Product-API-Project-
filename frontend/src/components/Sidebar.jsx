import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const role = user?.role;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <nav className="space-y-2">
        <NavLink className="block p-2 rounded hover:bg-gray-700" to="/dashboard/products">
          Products
        </NavLink>

        {(role === "admin" || role === "staff" || role === "super_staff") && (
          <NavLink className="block p-2 rounded hover:bg-gray-700" to="/dashboard/users">
            Users
          </NavLink>
        )}
      </nav>

      <button
        onClick={logout}
        className="mt-8 w-full bg-red-600 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
}
