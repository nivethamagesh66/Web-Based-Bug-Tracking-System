import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../assets/managePrograms.css";

const BugHistory = () => {
  const { id } = useParams(); // bugId from URL
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    console.log("🔐 Token for history:", token);

    if (!token) {
      setError("Unauthorized: No token found.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Fetch history failed:", err);
      setError("Failed to load bug history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-programs-container">
      <h2>Bug History (Bug ID #{id})</h2>
      <Link
        to="/view-bugs"
        style={{ color: "#00f", marginBottom: "15px", display: "inline-block" }}
      >
        ← Back to Bug List
      </Link>

      {loading ? (
        <p style={{ color: "#fff" }}>Loading history...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div style={{ overflowX: "auto", marginTop: "15px" }}>
          <table className="fullscreen-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Updated By</th>
                <th>Description of Change</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((entry) => (
                  <tr key={entry.historyId}>
                    <td>{entry.dateUpdated?.slice(0, 19).replace("T", " ")}</td>
                    <td>{entry.updatedBy?.name || "—"}</td>
                    <td style={{ maxWidth: "600px" }}>
                      <pre style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        fontFamily: "inherit",
                        margin: 0,
                      }}>
                        {entry.changeDescription}
                      </pre>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                    No history available for this bug.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BugHistory;
