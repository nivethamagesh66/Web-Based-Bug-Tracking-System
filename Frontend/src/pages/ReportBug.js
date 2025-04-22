import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/form.css";

const ReportBug = () => {
  const [programs, setPrograms] = useState([]);
  const [functionalAreas, setFunctionalAreas] = useState([]);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "LOW",
    reportType: "CODE_DEFECT",
    canReproduce: "Yes",
    priority: "Fix_immediately",
    programId: "",
    areaId: "",
    comments: "",
    treatAsDeferred: false,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8080/api/programs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPrograms(res.data);
  };

  const fetchFunctionalAreas = async (programId) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:8080/api/functional-areas/${programId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFunctionalAreas(res.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });

    if (name === "programId") {
      fetchFunctionalAreas(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const bugPayload = {
      title: form.title,
      description: form.description,
      severity: form.severity,
      reportType: form.reportType,
      canReproduce: form.canReproduce,
      priority: form.priority,
      comments: form.comments,
      treatAsDeferred: form.treatAsDeferred,
      status: "OPEN", // ✅ Always use uppercase for consistency
      program: { programId: parseInt(form.programId) },
      functionalArea: { areaId: parseInt(form.areaId) },
      reportedBy: { id: user.id },
    };

    const formData = new FormData();
    formData.append(
      "bug",
      new Blob([JSON.stringify(bugPayload)], { type: "application/json" })
    );
    if (file) {
      formData.append("attachment", file);
    }

    try {
      await axios.post("http://localhost:8080/api/bugs/report", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Bug reported successfully!");
      setForm({
        title: "",
        description: "",
        severity: "LOW",
        reportType: "CODE_DEFECT",
        canReproduce: "Yes",
        priority: "Fix_immediately",
        programId: "",
        areaId: "",
        comments: "",
        treatAsDeferred: false,
      });
      setFile(null);
      setFunctionalAreas([]);
    } catch (err) {
      console.error("Bug submission failed:", err);
      setError("Failed to report bug.");
    }
  };

  return (
    <div className="form-container">
      <h2>Report Bug</h2>
      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Bug Title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Bug Description" value={form.description} onChange={handleChange} required />

        <select name="programId" value={form.programId} onChange={handleChange} required>
          <option value="">Select Program</option>
          {programs.map((p) => (
            <option key={p.programId} value={p.programId}>
              {p.name} - v{p.version} (Release {p.releaseNum})
            </option>
          ))}
        </select>

        <select name="areaId" value={form.areaId} onChange={handleChange} required>
          <option value="">Select Functional Area</option>
          {functionalAreas.map((a) => (
            <option key={a.areaId} value={a.areaId}>{a.name}</option>
          ))}
        </select>

        <select name="severity" value={form.severity} onChange={handleChange}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <select name="reportType" value={form.reportType} onChange={handleChange}>
          <option value="CODE_DEFECT">Code Defect</option>
          <option value="DOCUMENTATION">Documentation</option>
          <option value="ENHANCEMENT">Enhancement</option>
          <option value="OTHER">Other</option>
        </select>

        <select name="priority" value={form.priority} onChange={handleChange}>
          <option value="Fix_immediately">Fix Immediately</option>
          <option value="Fix_ASAP">Fix ASAP</option>
          <option value="Fix_before_next_milestone">Fix Before Next Milestone</option>
          <option value="Fix_before_release">Fix Before Release</option>
          <option value="Fix_if_possible">Fix If Possible</option>
          <option value="Optional">Optional</option>
        </select>

        <select name="canReproduce" value={form.canReproduce} onChange={handleChange}>
          <option value="Yes">Reproducible</option>
          <option value="No">Not Reproducible</option>
        </select>

        <textarea name="comments" placeholder="Additional Comments" value={form.comments} onChange={handleChange} />

        <label style={{ color: "#fff", marginTop: "10px" }}>
          <input type="checkbox" name="treatAsDeferred" checked={form.treatAsDeferred} onChange={handleChange} style={{ marginRight: "8px" }} />
          Treat as Deferred
        </label>

        <input type="file" accept=".pdf,.jpg,.png,.docx,.txt" onChange={(e) => setFile(e.target.files[0])} />

        <button type="submit">Submit Bug</button>
      </form>
    </div>
  );
};

export default ReportBug;
