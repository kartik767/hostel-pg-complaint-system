import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Track which complaint is currently being updated (by ID)
  const [updatingId, setUpdatingId] = useState(null);
  // Track update success messages per complaint
  const [updateMsg, setUpdateMsg] = useState({});

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  async function fetchAllComplaints() {
    setLoading(true);
    setError("");
    try {
      // GET /complaints — fetches ALL complaints (admin only)
      const response = await api.get("/complaints");
      setComplaints(response.data);
    } catch (err) {
      setError("Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Update a complaint's status
  async function handleStatusChange(complaintId, newStatus) {
    setUpdatingId(complaintId);
    setUpdateMsg((prev) => ({ ...prev, [complaintId]: "" }));

    try {
      await api.put(`/complaints/${complaintId}`, { status: newStatus });

      // Update locally without re-fetching
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId ? { ...c, status: newStatus } : c
        )
      );

      setUpdateMsg((prev) => ({
        ...prev,
        [complaintId]: "✓ Status updated",
      }));

      // Clear success message after 2.5 seconds
      setTimeout(() => {
        setUpdateMsg((prev) => ({ ...prev, [complaintId]: "" }));
      }, 2500);
    } catch (err) {
      setUpdateMsg((prev) => ({
        ...prev,
        [complaintId]: "✗ Update failed",
      }));
    } finally {
      setUpdatingId(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  // Stats
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "in-progress"
  ).length;

  return (
    <div className="page-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="dot"></span>
          ResidenceDesk — Admin
        </div>
        <div className="navbar-actions">
          <span className="navbar-user">{user.name || "Admin"}</span>
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
            <h1 className="page-title">All Complaints</h1>
            <p className="page-subtitle">
              Review, manage, and resolve resident complaints
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={fetchAllComplaints}
          >
            ↻ Refresh
          </button>
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
            <span>Loading all complaints...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="alert alert-error">
            {error}{" "}
            <button
              className="btn btn-sm btn-outline"
              onClick={fetchAllComplaints}
              style={{ marginLeft: 8 }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && complaints.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📬</div>
            <h3>No complaints found</h3>
            <p>No complaints have been submitted yet.</p>
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
                    {/* Submitted by info */}
                    {complaint.user && (
                      <span className="meta-item">
                        👤{" "}
                        {complaint.user.name ||
                          complaint.user.email ||
                          "Unknown"}
                      </span>
                    )}
                    <span className="meta-item">
                      📅 {formatDate(complaint.createdAt)}
                    </span>
                    {complaint.category && (
                      <span className="meta-item">
                        🏷️ {complaint.category}
                      </span>
                    )}
                  </div>

                  {/* Admin: Status update row */}
                  <div className="admin-row" style={{ marginTop: "12px" }}>
                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        handleStatusChange(complaint._id, e.target.value)
                      }
                      disabled={updatingId === complaint._id}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    {/* Update feedback message */}
                    {updateMsg[complaint._id] && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: updateMsg[complaint._id].startsWith("✓")
                            ? "var(--success)"
                            : "var(--error)",
                          fontFamily: "DM Mono, monospace",
                        }}
                      >
                        {updateMsg[complaint._id]}
                      </span>
                    )}

                    {updatingId === complaint._id && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          fontFamily: "DM Mono, monospace",
                        }}
                      >
                        Updating...
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Current status badge */}
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
