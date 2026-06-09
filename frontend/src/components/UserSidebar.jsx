import React from "react";
import { useNavigate } from "react-router-dom";

import "../styles/UserSidebar.css";

function UserSidebar({
  activePage,
  setActivePage,
  isOpen,
  setIsOpen,
}) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();

    navigate("/", {
      replace: true,
    });
  };

  const navigateTo = (page, path) => {
    setActivePage(page);

    navigate(path);

    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${
          isOpen ? "show-overlay" : ""
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`sidebar ${
          isOpen ? "open" : ""
        }`}
      >

        <div className="sidebar-logo">
          AI Assistant
        </div>

        <div
          className={`sidebar-item 
           ${ activePage === "dashboard" ? "active" : "" }`}
           onClick={() => navigateTo( "dashboard", "/user-dashboard" )} >Dashboard
        </div>

        <div
          className={`sidebar-item 
          ${activePage === "profile" ? "active" : ""}`}
          onClick={() => navigateTo( "profile", "/user-profile" )}> Profile
        </div>

        <div className={`sidebar-item 
        ${ activePage === "leads"? "active" : ""}`}
        onClick={() => navigateTo( "leads", "/leads" ) } > Leads 
        </div>

        <div
          className={`sidebar-item
           ${ activePage === "activity" ? "active" : ""}`}
          onClick={() => navigateTo("activity", "/user-activity" ) }>Activity
        </div>

        <div
          className={`sidebar-item
          ${ activePage === "settings" ? "active" : "" }`}
          onClick={() => navigateTo( "settings","/user-settings")}>Settings
        </div>

        <div
          className="sidebar-item logout"
          onClick={logout}
        >
          Logout
        </div>

      </aside>
    </>
  );
}

export default UserSidebar;