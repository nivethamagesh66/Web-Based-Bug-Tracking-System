import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../assets/form.css";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/users/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          const { name, login_id, level } = response.data;
          setName(name);
          setLoginId(login_id);
          setLevel(level.toString());
        }
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/api/users/update/${id}`,
        { name, login_id: loginId, level: parseInt(level) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("User updated successfully!");
      setTimeout(() => navigate("/admin-dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <div className="form-container">
      <h2>Edit User</h2>
      {isLoading && <p>Loading user details...</p>}
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      {!isLoading && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Login ID"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            required
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          >
            <option value="1">Tester</option>
            <option value="2">Employee</option>
            <option value="3">Admin</option>
          </select>
          <button type="submit">Update User</button>
        </form>
      )}
    </div>
  );
};

export default EditUser;
