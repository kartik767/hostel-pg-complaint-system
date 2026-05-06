import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";

// Format date nicely
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Return CSS class for status badge
function getBadgeClass(status) {
  if (status === "pending") return "badge badge-pending";
  if (status === "in-progress") return "badge badge-in-progress";
  if (status === "resolved") return "badge badge-resolved";
  return "badge badge-pending";
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Get logged-in user info from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user's own complaints on mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  async function fetchComplaints() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/complaints/my");
      setComplaints(response.data);
    } catch (err) {
      setError("Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Logout handler
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // Count complaints by status
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
  const inProgressCount = complaints.filter((c) => c.status === "in-progress").length;

  return (
    <div className="page-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="dot"></span>
          ResidenceDesk
        </div>
        <div className="navbar-actions">
          <span className="navbar-user">{user.name || "Student"}</span>
          <button className="navbar-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">My Complaints</h1>
            <p className="page-subtitle">
              Track and manage your submitted issues
            </p>
          </div>
          <Link to="/create-complaint" className="btn btn-accent">
            + New Complaint
          </Link>
        </div>

        {/* Stats Bar */}
        {!loading && !error && (
          <div className="stats-bar">
            <div className="stat-chip">
              <span className="stat-label">Total</span>
              <span className="stat-value">{totalCount}</span>
            </div>
            <div className="stat-chip">
              <span className="stat-label">Pending</span>
              <span className="stat-value" style={{ color: "#8a5c00" }}>
                {pendingCount}
              </span>
            </div>
            <div className="stat-chip">
              <span className="stat-label">In Progress</span>
              <span className="stat-value" style={{ color: "#1a4a8a" }}>
                {inProgressCount}
              </span>
            </div>
            <div className="stat-chip">
              <span className="stat-label">Resolved</span>
              <span className="stat-value" style={{ color: "#1a6b36" }}>
                {resolvedCount}
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-wrap">
            <div className="spinner"></div>
            <span>Loading your complaints...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error">
            {error}{" "}
            <button
              className="btn btn-sm btn-outline"
              onClick={fetchComplaints}
              style={{ marginLeft: 8 }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && complaints.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3>No complaints yet</h3>
            <p>Submit your first complaint and we'll get it sorted.</p>
            <Link to="/create-complaint" className="btn btn-primary">
              Submit a Complaint
            </Link>
          </div>
        )}

        {/* Complaints List */}
        {!loading && !error && complaints.length > 0 && (
          <div className="complaints-grid">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="complaint-card">
                {/* Left: Details */}
                <div>
                  <div className="complaint-title">{complaint.title}</div>
                  <div className="complaint-description">
                    {complaint.description}
                  </div>
                  <div className="complaint-meta">
                    <span className="meta-item">
                      📅 {formatDate(complaint.createdAt)}
                    </span>
                    {complaint.category && (
                      <span className="meta-item">
                        🏷️ {complaint.category}
                      </span>
                    )}
                  </div>
                </div>
                {/* Right: Status badge */}
                <div>
                  <span className={getBadgeClass(complaint.status)}>
                    {complaint.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
