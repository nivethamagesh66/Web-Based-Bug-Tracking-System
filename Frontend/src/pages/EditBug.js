import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/form.css";

const EditBug = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedToId, setAssignedToId] = useState("");
  const [resolvedById, setResolvedById] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBug();
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchBug = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8080/api/bugs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bugData = res.data.find((b) => b.bugId === parseInt(id));
      if (bugData) {
        setBug(bugData);
        setAssignedToId(bugData.assignedTo?.id || "");
        setResolvedById(bugData.resolvedBy?.id || "");
      } else {
        setError("Bug not found.");
      }
    } catch {
      setError("Failed to fetch bug details.");
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      setError("Failed to load users.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBug({ ...bug, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const currentUser = JSON.parse(localStorage.getItem("user")); // ✅ logged-in user

      const updatedBug = {
        ...bug,
        comments: bug.comments || "",
        assignedTo: assignedToId ? { id: parseInt(assignedToId) } : null,
        resolvedBy: resolvedById ? { id: parseInt(resolvedById) } : null,
        // ❌ DO NOT override reportedBy here; backend will retain it
      };
console.log(currentUser.id);
console.log("⬆️ Sending update for bug ID:", id);
console.log("📤 userId in PUT:", currentUser.id);
console.log("📝 updatedBug:", updatedBug);
      await axios.put(
        `http://localhost:8080/api/bugs/${id}?userId=${currentUser.id}`, // ✅ correct editor passed
        updatedBug,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Bug updated successfully!");
      setTimeout(() => navigate("/view-bugs"), 1500);
    } catch (err) {
      console.error("Bug update failed:", err);
      setError("Failed to update bug.");
    }
  };

  if (!bug) return <p>Loading bug data...</p>;

  return (
    <div className="form-container">
      <h2>Edit Bug</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="title" value={bug.title} onChange={handleChange} required />
        <textarea name="description" value={bug.description} onChange={handleChange} required />

        <select name="severity" value={bug.severity} onChange={handleChange}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <select name="priority" value={bug.priority} onChange={handleChange}>
          <option value="Fix_immediately">Fix Immediately</option>
          <option value="Fix_ASAP">Fix ASAP</option>
          <option value="Fix_before_next_milestone">Fix Before Milestone</option>
          <option value="Fix_before_release">Fix Before Release</option>
          <option value="Fix_if_possible">Fix If Possible</option>
          <option value="Optional">Optional</option>
        </select>

        <select name="status" value={bug.status || ""} onChange={handleChange}>
          <option value="">Select Status</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select name="resolutionStatus" value={bug.resolutionStatus || ""} onChange={handleChange}>
          <option value="">Select Resolution</option>
          <option value="FIXED">Fixed</option>
          <option value="CANNOT_REPRODUCE">Cannot Reproduce</option>
          <option value="WONT_FIX">Won't Fix</option>
          <option value="INCOMPLETE">Incomplete</option>
          <option value="DUPLICATE">Duplicate</option>
        </select>

        <select name="assignedToId" value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)}>
          <option value="">Assigned To</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <select name="resolvedById" value={resolvedById} onChange={(e) => setResolvedById(e.target.value)}>
          <option value="">Resolved By</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>

        <textarea name="comments" value={bug.comments || ""} onChange={handleChange} placeholder="Comments" />

        <div style={{ margin: "10px 0" }}>
          <label>
            <input
              type="checkbox"
              name="treatAsDeferred"
              checked={bug.treatAsDeferred || false}
              onChange={handleChange}
              style={{ marginRight: "8px" }}
            />
            Treat as Deferred
          </label>
        </div>

        <button type="submit">Update Bug</button>
      </form>
    </div>
  );
};

export default EditBug;
