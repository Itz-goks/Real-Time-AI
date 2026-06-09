import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserActivity.css";
import { useNavigate } from "react-router-dom";

function UserActivity() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user/activity/${userId}`
      );

      setActivities(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredActivities = activities.filter((activity) =>
    activity.action.toLowerCase().includes(
      search.toLowerCase()
    )
  );

  return (
    <div className="page-container">

      <h1>Activity History</h1>

      <input
        type="text"
        placeholder="Search activity..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="activity-table">

        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="activity-row"
          >
            <div>
              <strong>
                {activity.action}
              </strong>
            </div>

            <div>
              {new Date(
                activity.created_at
              ).toLocaleString()}
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default UserActivity;