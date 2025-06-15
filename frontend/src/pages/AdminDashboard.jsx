import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

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

    if (user?.role === "admin") {
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

  if (user?.role !== "admin") {
    return (
      <div className="text-center mt-10 text-red-500 text-lg font-semibold">
        Access Denied: Admins only.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">
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
                    {u.role}
                  </td>
                  <td className="border border-gray-300 text-center">
                    <Link
                      to={`/user-books/${u._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </td>
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
