import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../assets/editProgram.css";

const EditProgram = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { program } = location.state || {};

  const [name, setName] = useState(program?.name || "");
  const [version, setVersion] = useState(program?.version || "");
  const [releaseNum, setReleaseNum] = useState(program?.releaseNum || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !version || !releaseNum) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // ✅ Fix here: use programId
      await axios.put(
        `http://localhost:8080/api/programs/${program.programId}`,
        { name, version, releaseNum },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Program updated successfully!");
      setTimeout(() => navigate("/manage-programs"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update program.");
    }
  };

  return (
    <div className="edit-program-container">
      <h2>Edit Program</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Program Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Version"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Release Number"
          value={releaseNum}
          onChange={(e) => setReleaseNum(e.target.value)}
          required
        />
        <button type="submit">Update Program</button>
      </form>
    </div>
  );
};

export default EditProgram;
