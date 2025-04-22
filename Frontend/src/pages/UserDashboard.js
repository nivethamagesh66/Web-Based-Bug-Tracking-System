import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/dashboard.css";

function UserDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">User Dashboard</h2>
      <div className="dashboard-buttons">
        <button
          onClick={() => navigate("/report-bug")}
          className="dashboard-button"
        >
          Report Bug
        </button>
        <button
          onClick={() => navigate("/view-bugs")}
          className="dashboard-button"
        >
          View Bugs
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="dashboard-button logout-button"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
