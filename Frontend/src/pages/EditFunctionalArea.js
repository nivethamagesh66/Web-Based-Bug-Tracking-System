import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/functionalArea.css";

const EditFunctionalArea = () => {
  const [functionalAreas, setFunctionalAreas] = useState([]);
  const [selectedFunctionalArea, setSelectedFunctionalArea] = useState(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleUpdateFunctionalArea = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedFunctionalArea || !newName.trim()) {
      setError("Please select a functional area and enter a valid name.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/functional-areas/update/${selectedFunctionalArea}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Functional Area updated successfully!");
      setNewName("");
      fetchFunctionalAreas();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update functional area."
      );
    }
  };

  return (
    <div className="functional-area-container">
      <h2>Edit Functional Area</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleUpdateFunctionalArea}>
        <select
          onChange={(e) => setSelectedFunctionalArea(e.target.value)}
          required
        >
          <option value="">Select Functional Area</option>
          {functionalAreas.map((area) => (
            <option key={area.area_id} value={area.area_id}>
              {area.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter New Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <button type="submit">Update Functional Area</button>
      </form>
    </div>
  );
};

export default EditFunctionalArea;
