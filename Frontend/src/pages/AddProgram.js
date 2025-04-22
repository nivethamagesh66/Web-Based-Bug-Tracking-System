import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/addProgram.css";

const AddProgram = () => {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [releaseNum, setReleaseNum] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/programs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrograms(response.data);
      console.log("Programs fetched:", response.data);
    } catch (err) {
      setError("Failed to load programs.");
    }
  };

  const handleAddProgram = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !version || !releaseNum) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/programs/add",
        {
          name,
          version: parseInt(version),
          releaseNum: parseInt(releaseNum),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Program added successfully!");
      setName("");
      setVersion("");
      setReleaseNum("");
      fetchPrograms();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add program.");
    }
  };

  return (
    <div className="program-container">
      <div className="program-content">
        {/* Form Section */}
        <div className="program-form">
          <h3>Add Program</h3>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <form onSubmit={handleAddProgram}>
            <input
              type="text"
              placeholder="Enter Program Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Enter Version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Enter Release Number"
              value={releaseNum}
              onChange={(e) => setReleaseNum(e.target.value)}
              required
            />
            <button type="submit">Add Program</button>
          </form>
        </div>

        {/* Existing Program List */}
        <div className="program-list">
          <h3>Existing Programs</h3>
          <ul>
            {programs.length > 0 ? (
              programs.map((program) => (
                <li key={program.program_id}>
                  {program.name} - Version {program.version} (Release{" "}
                  {program.releaseNum})
                </li>
              ))
            ) : (
              <li>No programs available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddProgram;
