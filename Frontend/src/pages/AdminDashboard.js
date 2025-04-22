import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="dashboard-buttons">
        <button onClick={() => navigate("/add-user")} className="dashboard-button">
          Add User
        </button>
        <button onClick={() => navigate("/manage-users")} className="dashboard-button">
          Manage Users
        </button>
        <button onClick={() => navigate("/add-program")} className="dashboard-button">
          Add Program
        </button>
        <button onClick={() => navigate("/manage-programs")} className="dashboard-button">
          Manage Programs
        </button>
        <button onClick={() => navigate("/add-area")} className="dashboard-button">
          Add Functional Area
        </button>
        <button onClick={() => navigate("/manage-functional-areas")} className="dashboard-button">
          Manage Functional Areas
        </button>
        <button onClick={() => navigate("/view-bugs")} className="dashboard-button">
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

export default AdminDashboard;
