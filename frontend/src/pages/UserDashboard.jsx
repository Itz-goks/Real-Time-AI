import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/UserDashboard.css";
import UserSidebar from "../components/UserSidebar";

function UserDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // Route Protection
  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true });
      return;
    }

    fetchDashboard();
  }, [userId]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/dashboard/${userId}`
      );

      setDashboard(res.data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);

      if (err.response?.status === 404) {
        localStorage.clear();
        navigate("/", { replace: true });
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  if (!dashboard) {
    return (
      <div className="loading-screen">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <UserSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <button className="menu-btn"
           onClick={() => setIsSidebarOpen(!isSidebarOpen)}> ☰ </button>

          <div className="brand-title">
            <span className="brand-logo"></span>

            <h2>
              AI Sales Call Assistant
            </h2>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </header>

        {/* Content Grid */}
        <div className="cards-grid">

          {/* LEFT SIDE */}
          <div className="left-column">

            {/* Welcome Card */}
            <div className="welcome-card">

              <div className="avatar"></div>

              <div className="welcome-text">

                <h3>
                  Welcome, {dashboard.nickname || "User"} 👋
                </h3>

                <p>
                  Great to see you back.
                </p>

              </div>

            </div>

            {/* Recent Activity */}
            <div className="activity-card">

              <h3>Recent Activity</h3>

              <div className="activity-list">

                {dashboard.recent_activities?.length > 0 ? (
                  dashboard.recent_activities.map(
                    (activity, index) => (
                      <div
                        key={index}
                        className="activity-item"
                      >
                        <strong>
                          {activity.action}
                        </strong>

                        <span className="meta">
                          {new Date(
                            activity.created_at
                          ).toLocaleString()}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <p>No activities found.</p>
                )}

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="right-column">

            {/* Profile Card */}
            <div className="stats-card">

              <h3>Profile</h3>

              <div className="stats-row">
                <div className="stat-item">
                  <h4>Email</h4>
                  <p>{dashboard.email}</p>
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-item">
                  <h4>Role</h4>
                  <p>{dashboard.role}</p>
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-item">
                  <h4>Nickname</h4>
                  <p>
                    {dashboard.nickname || "Not Set"}
                  </p>
                </div>
              </div>

            </div>

            {/* Activity Count */}
            <div className="stats-card">

              <h3>Total Activities</h3>

              <h1>
                {dashboard.activity_count}
              </h1>

            </div>

            {/* Last Login */}
            <div className="stats-card">

              <h3>Last Login</h3>

              <p>
                {new Date(
                  dashboard.last_login
                ).toLocaleString()}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;