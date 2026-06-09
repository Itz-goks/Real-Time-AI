// src/App.jsx

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import UserActivity from "./pages/UserActivity";
import UserSettings from "./pages/UserSettings";
import "./styles/App.css";
import Leads from "./pages/Leads";
import LeadDetails from "./pages/LeadDetails";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const storedUserId = localStorage.getItem("userId");

  const [activities, setActivities] = useState([]);

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.body.style.setProperty("--x", `${e.clientX}px`);
      document.body.style.setProperty("--y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Fetch user activities
  const fetchActivity = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/activity/${storedUserId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const data = await response.json();

      setActivities(data);

      console.log("Activities:", data);
    } catch (error) {
      console.error("Activity Fetch Error:", error);
    }
  };

  // Load activities when user logs in
  useEffect(() => {
    if (storedUserId) {
      fetchActivity();
    }
  }, [storedUserId]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />}/>

        <Route
        path="/user-dashboard"
        element={
        <ProtectedRoute> <UserDashboard /> </ProtectedRoute> }/>

        <Route
        path="/user-profile"
        element={
        <ProtectedRoute> <UserProfile /> </ProtectedRoute>}/>

        <Route
        path="/user-activity"
        element={
        <ProtectedRoute> <UserActivity /> </ProtectedRoute> }/>

        <Route
        path="/user-settings"
        element={
        <ProtectedRoute> <UserSettings /> </ProtectedRoute> } />

       <Route
       path="/leads"
       element={
       <ProtectedRoute> <Leads /> </ProtectedRoute> }/>
    
       <Route
       path="/lead/:id"
       element={
      <ProtectedRoute> <LeadDetails /> </ProtectedRoute> }/>

      <Route
      path="/lead/:id"
      element={
    <ProtectedRoute> <LeadDetails /> </ProtectedRoute> }/>

      </Routes>
    </Router>
 );
}

export default App;