import React, { useEffect, useState } from "react";
import axios from "axios";

function UserSettings() {
  const userId = localStorage.getItem("userId");

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user/profile/${userId}`
      );

      setNickname(res.data.nickname || "");
      setEmail(res.data.email);
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/user/settings/${userId}`,
        {
          nickname,
          email,
          password
        }
      );

      setMessage("Settings saved successfully");
      setPassword("");
    } catch (err) {
      setMessage("Failed to save settings");
    }
  };

  return (
    <div className="page-container">

      <h2>User Settings</h2>

      <form
        className="settings-form"
        onSubmit={saveSettings}
      >
        <label>Nickname</label>

        <input
          value={nickname}
          onChange={(e) =>
            setNickname(e.target.value)
          }
        />

        <label>Email</label>

        <input
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <label>New Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Save Settings
        </button>

      </form>

      {message && (
        <p>{message}</p>
      )}

    </div>
  );
}

export default UserSettings;