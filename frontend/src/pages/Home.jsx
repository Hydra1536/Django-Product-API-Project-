import { logout } from "../utils/auth";
export default function Home() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-4">
        
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            onClick={logout}
          >
            Logout
          </button>

      </div>
    </div>
  );
}
