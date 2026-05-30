import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState(null); // banner message

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (err) {
      setNotification({ type: "error", message: "Error fetching Users" });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/create_user", {
        email,
        password,
        role,
      });
      setNotification({ type: "success👍", message: res.data.message });
      setEmail("");
      setPassword("");
      setRole("User");
      fetchUsers();
    } catch (err) {
      setNotification({ type: "error", message: "Error creating User☹️" });
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete_user/${id}`);
      setNotification({ type: "success", message: "User deleted successfully👍" });
      fetchUsers();
    } catch (err) {
      setNotification({ type: "error", message: "Error deleting User☹️" });
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/update_user/${id}`, { role: newRole });
      setNotification({ type: "success", message: "Role updated successfully👍" });
      fetchUsers();
    } catch (err) {
      setNotification({ type: "error", message: "Error updating Role☹️" });
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Create New User/Admin</h2>

      {/* Notification Banner */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <span className="close-btn" onClick={() => setNotification(null)}>×</span>
        </div>
      )}

      <form onSubmit={handleCreateUser}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Create✅</button>
      </form>

      <h2>Manage Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(u.id)}>Delete❎</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
