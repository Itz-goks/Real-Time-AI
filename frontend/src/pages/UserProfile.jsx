import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/UserProfile.css";

function UserProfile() {
  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState(null);

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/user/profile/${userId}`
      );

      setProfile(res.data);
      setEmail(res.data.email);
      setNickname(res.data.nickname || "");
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async () => {
    try {
      await axios.put(
        `http://localhost:5000/user/update/${userId}`,
        {
          email,
          password
        }
      );

      await axios.put(
        `http://localhost:5000/user/settings/${userId}`,
        {
          nickname
        }
      );

      alert("Profile updated successfully");

      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (!profile) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="page-container">

      <h1>Profile</h1>

      <div className="profile-form">

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

        <button
          onClick={updateProfile}
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}

export default UserProfile;