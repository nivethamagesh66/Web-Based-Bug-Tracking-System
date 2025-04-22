import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/manageFunctionalAreas.css";

const ManageFunctionalAreas = () => {
  const [functionalAreas, setFunctionalAreas] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFunctionalAreas();
  }, []);

  const fetchFunctionalAreas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/functional-areas",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFunctionalAreas(response.data);
    } catch (err) {
      setError("Failed to load functional areas.");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this functional area?"
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/functional-areas/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchFunctionalAreas();
    } catch (err) {
      setError("Failed to delete functional area.");
    }
  };

  return (
    <div className="manage-functional-areas-container">
      <h2>Manage Functional Areas</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="scrollable-table-container">
        <table className="functional-areas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Functional Area</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {functionalAreas.length > 0 ? (
              functionalAreas.map((area) => (
                <tr key={area.areaId}>
                  <td>{area.areaId}</td>
                  <td>{area.name}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(area.areaId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No functional areas found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFunctionalAreas;
