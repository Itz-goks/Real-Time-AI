import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();

  // ✅ Use your actual Flask backend tunnel URL (port 5000)
  const api = axios.create({
    baseURL: "http://127.0.0.1:5000", // Flask backend tunnel URL
    // baseURL: "http://localhost:5000/", // Local development URL
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", { email, password, role });

      if (res.data.role === "admin") {
        setNotification({ type: "success", message: "Admin login successful 👍" });
        setTimeout(() => navigate("/admin-dashboard"), 1000);
      } else {
        setNotification({ type: "success", message: "User login successful 👍" });
        setTimeout(() => navigate("/user-dashboard"), 1000);
      }
    } catch (err) {
      console.error("Login error:", err.response || err.message);
      setNotification({
        type: "error",
        message: err.response?.data?.error || "Login failed ☹️",
      });
    }
  };

  return (
    <div className="login-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <span className="close-btn" onClick={() => setNotification(null)}>×</span>
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="role-options">
          <label>
            <input
              type="radio"
              value="user"
              checked={role === "user"}
              onChange={(e) => setRole(e.target.value)}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              value="admin"
              checked={role === "admin"}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>
        </div>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
