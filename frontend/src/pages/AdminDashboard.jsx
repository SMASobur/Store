import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoading(true);
      await axios.put(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh users
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Failed to update role", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh list
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Failed to delete user", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    if (user?.role === "admin" || user?.role === "superadmin") {
      fetchUsers();
    }
  }, [user, token]);

  useEffect(() => {
    const query = search.toLowerCase();
    const results = users.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
    setFilteredUsers(results);
  }, [search, users]);

  // Check for admin/superadmin access
  if (!(user?.role === "admin" || user?.role === "superadmin")) {
    return (
      <div className="text-center mt-10 text-red-500 text-lg font-semibold">
        Access Denied: Admins only.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-400">
        Admin Dashboard
      </h1>
      <div className="flex justify-center md:justify-end mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded shadow-sm w-full max-w-md"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-2 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 rounded">#</th>
                <th className="border border-gray-300 p-2 rounded">Name</th>
                <th className="border border-gray-300 p-2 rounded hidden md:table-cell">
                  Email
                </th>
                <th className="border border-gray-300 p-2 rounded">Role</th>
                <th className="border border-gray-300 p-2 rounded">Books</th>
                {user.role === "superadmin" && (
                  <th className="border border-gray-300 p-2 rounded">🗑️</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, index) => (
                <tr key={u._id}>
                  <td className="border border-gray-300 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 text-center break-words">
                    {u.name}
                  </td>
                  <td className="border border-gray-300 text-center hidden md:table-cell break-words">
                    {u.email}
                  </td>
                  <td className="border border-gray-300 text-center">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="border px-2 py-1 rounded"
                      disabled={
                        loading ||
                        (user.role === "admin" && u.role === "superadmin")
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      {user.role === "superadmin" && (
                        <option value="superadmin">Superadmin</option>
                      )}
                    </select>
                  </td>
                  <td className="border border-gray-300 text-center">
                    <Link
                      to={`/user-books/${u._id}`}
                      className="text-orange-400 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                  {user.role === "superadmin" && (
                    <td className="border border-gray-300 text-center">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
