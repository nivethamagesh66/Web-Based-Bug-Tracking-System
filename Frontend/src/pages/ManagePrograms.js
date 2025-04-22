import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/managePrograms.css";

const ManagePrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    } catch (err) {
      setError("Failed to load programs.");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this program? This action cannot be undone."
      )
    )
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/programs/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPrograms((prevPrograms) =>
        prevPrograms.filter((program) => program.program_id !== id)
      );
    } catch (err) {
      setError("Failed to delete program.");
    }
  };

  return (
    <div className="manage-programs-container">
      <h2>Manage Programs</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>Release</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.program_id}>
                <td>{program.name}</td>
                <td>{program.version}</td>
                <td>{program.releaseNum}</td>
                <td>
                  <div className="button-container">
                    <button
                      className="edit-button"
                      onClick={() =>
                        navigate(`/edit-program/${program.program_id}`, {
                          state: { program },
                        })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(program.program_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePrograms;
