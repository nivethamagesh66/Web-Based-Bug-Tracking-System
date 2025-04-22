import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/managePrograms.css";

const ViewBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    title: "",
    severity: "",
    priority: "",
    status: "",
    resolutionStatus: "",
    assignedTo: "",
    reportedBy: "",
    treatAsDeferred: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("Unauthorized: No token found.");
      return;
    }
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/bugs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (Array.isArray(res.data)) {
        setBugs(res.data);
        setFiltered(res.data);
      }
    } catch (err) {
      console.error("Error fetching bugs:", err);
      setError("Failed to fetch bugs.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);

    const filteredData = bugs.filter((bug) => {
      return (
        (updated.title === "" || bug.title?.toLowerCase().includes(updated.title.toLowerCase())) &&
        (updated.severity === "" || bug.severity === updated.severity) &&
        (updated.priority === "" || bug.priority === updated.priority) &&
        (updated.status === "" || bug.status?.toUpperCase() === updated.status) &&
        (updated.resolutionStatus === "" || bug.resolutionStatus === updated.resolutionStatus) &&
        (updated.assignedTo === "" || bug.assignedTo?.name === updated.assignedTo) &&
        (updated.reportedBy === "" || bug.reportedBy?.name === updated.reportedBy) &&
        (updated.treatAsDeferred === "" || String(bug.treatAsDeferred) === updated.treatAsDeferred)
      );
    });

    setFiltered(filteredData);
  };

  const exportToCSV = () => {
    const headers = [
      "Bug ID", "Title", "Program", "Area", "Severity", "Priority",
      "Status", "Resolution", "Reporter", "Assigned To", "Resolved By",
      "Comments", "Reported On", "Deferred"
    ];

    const rows = filtered.map(bug => [
      bug.bugId,
      bug.title,
      bug.program?.name || "—",
      bug.functionalArea?.name || "—",
      bug.severity,
      bug.priority,
      bug.status,
      bug.resolutionStatus,
      bug.reportedBy?.name || "—",
      bug.assignedTo?.name || "—",
      bug.resolvedBy?.name || "—",
      bug.comments || "—",
      bug.dateReported?.slice(0, 10) || "—",
      bug.treatAsDeferred ? "Yes" : "No"
    ]);

    const csvContent = [headers, ...rows]
      .map(e => e.map(field => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bugs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: "40px 0", display: "flex", justifyContent: "center" }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.05)",
        padding: "30px",
        borderRadius: "14px",
        width: "100%",
        maxWidth: "1500px",
        boxShadow: "0px 12px 24px rgba(0,0,0,0.25)"
      }}>
        <h2 style={{ fontSize: "2.4rem", marginBottom: "25px", textAlign: "center", color: "#fff" }}>
          Reported Bugs
        </h2>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px", justifyContent: "center" }}>
          <input type="text" name="title" value={filters.title} onChange={handleFilterChange} placeholder="Search by Title" style={{ padding: "10px", minWidth: "200px", borderRadius: "6px" }} />
          {["severity", "priority", "status", "resolutionStatus", "assignedTo", "reportedBy", "treatAsDeferred"].map((field) => (
            <select key={field} name={field} value={filters[field]} onChange={handleFilterChange} style={{ padding: "10px", minWidth: "150px", borderRadius: "6px" }}>
              <option value="">{field.replace(/([A-Z])/g, " $1")}</option>
              {field === "severity" && ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(v => <option key={v}>{v}</option>)}
              {field === "priority" && ["Fix_immediately", "Fix_ASAP", "Fix_before_next_milestone", "Fix_before_release", "Fix_if_possible", "Optional"].map(v => <option key={v}>{v}</option>)}
              {field === "status" && ["OPEN", "RESOLVED", "CLOSED"].map(v => <option key={v}>{v}</option>)}
              {field === "resolutionStatus" && ["FIXED", "CANNOT_REPRODUCE", "WONT_FIX", "INCOMPLETE", "DUPLICATE"].map(v => <option key={v}>{v}</option>)}
              {field === "assignedTo" && [...new Set(bugs.map(b => b.assignedTo?.name))].filter(Boolean).map(v => <option key={v}>{v}</option>)}
              {field === "reportedBy" && [...new Set(bugs.map(b => b.reportedBy?.name))].filter(Boolean).map(v => <option key={v}>{v}</option>)}
              {field === "treatAsDeferred" && ["true", "false"].map(v => <option key={v}>{v === "true" ? "Yes" : "No"}</option>)}
            </select>
          ))}
        </div>

        {/* Export Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <button onClick={exportToCSV} style={{
            padding: "10px 18px",
            borderRadius: "6px",
            background: "#00a86b",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}>
            Export as CSV
          </button>
        </div>

        {/* Bug Table */}
        <div style={{ overflowX: "auto", borderRadius: "10px", background: "rgba(0,0,0,0.8)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "white", fontSize: "15px" }}>
            <thead>
              <tr style={{ background: "#000" }}>
                <th>ID</th>
                <th>Title</th>
                <th>Program</th>
                <th>Area</th>
                <th>Severity</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Resolution</th>
                <th>Reporter</th>
                <th>Assigned To</th>
                <th>Resolved By</th>
                <th>Comments</th>
                <th>Reported On</th>
                <th>Deferred</th>
                {user?.level === 3 && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((bug) => (
                  <tr key={bug.bugId} style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    <td>{bug.bugId}</td>
                    <td>{bug.title}</td>
                    <td>{bug.program?.name || "—"}</td>
                    <td>{bug.functionalArea?.name || "—"}</td>
                    <td>{bug.severity || "—"}</td>
                    <td>{bug.priority || "—"}</td>
                    <td>{bug.status || "OPEN"}</td>
                    <td>{bug.resolutionStatus || "—"}</td>
                    <td>{bug.reportedBy?.name || "—"}</td>
                    <td>{bug.assignedTo?.name || "—"}</td>
                    <td>{bug.resolvedBy?.name || "—"}</td>
                    <td>{bug.comments || "—"}</td>
                    <td>{bug.dateReported?.slice(0, 10) || "N/A"}</td>
                    <td>{bug.treatAsDeferred ? "Yes" : "No"}</td>
                    {user?.level === 3 && (
                      <td style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <button
                          onClick={() => navigate(`/edit-bug/${bug.bugId}`, { state: { bug } })}
                          style={{ padding: "6px", background: "#1e90ff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/bug-history/${bug.bugId}`)}
                          style={{ padding: "6px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                          History
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={user?.level === 3 ? 15 : 14} style={{ textAlign: "center", padding: "20px" }}>
                    No bugs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewBugs;
