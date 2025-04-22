import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/functionalArea.css";

const AddFunctionalArea = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [areaName, setAreaName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/programs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Programs loaded:", response.data);
      setPrograms(response.data);
    } catch (err) {
      setError("Failed to load programs.");
    }
  };

  const handleAddFunctionalArea = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const parsedId = parseInt(selectedProgram);
    console.log("Parsed Program ID:", parsedId);
    console.log("Area Name:", areaName);

    if (!parsedId || isNaN(parsedId) || !areaName.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/functional-areas/add",
        {
          program: { programId: parsedId },
          name: areaName.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Functional Area added successfully!");
      setAreaName("");
      setSelectedProgram("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add functional area.");
    }
  };

  return (
    <div className="functional-area-container">
      <h2>Add Functional Area</h2>


      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleAddFunctionalArea}>
        <select
          value={selectedProgram}
          onChange={(e) => setSelectedProgram(e.target.value)}
          required
        >
          <option value="">Select Program</option>
          {Array.isArray(programs) &&
            programs
              .filter((program) => !!program.programId)
              .map((program, index) => (
                <option
                  key={program.program_id ?? `${program.name}-${program.version}-${program.releaseNum}-${index}`}
                  value={String(program.programId)}
                >
                  {program.name} - v{program.version} (Release {program.releaseNum})
                </option>
              ))}
        </select>

        <input
          type="text"
          placeholder="Enter Functional Area Name"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          required
        />

        <button type="submit">Add Functional Area</button>
      </form>
    </div>
  );
};

export default AddFunctionalArea;
