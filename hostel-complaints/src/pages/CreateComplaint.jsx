import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";

// Complaint categories
const CATEGORIES = [
  "Electrical",
  "Plumbing",
  "Cleaning",
  "Furniture",
  "Security",
  "Food",
  "Internet / Wi-Fi",
  "Noise",
  "Other",
];

export default function CreateComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    roomNumber: "",
    category: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.roomNumber.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/complaints", formData);

      setSuccess("Complaint submitted successfully!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to submit complaint.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="dot"></span>
          ResidenceDesk
        </div>

        <div className="navbar-actions">
          <Link to="/dashboard" className="navbar-btn">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content container">
        <div className="page-header">
          <div>
            <h1 className="page-title">New Complaint</h1>

            <p className="page-subtitle">
              Describe your issue and we'll look into it promptly
            </p>
          </div>
        </div>

        <div className="form-card">
          {/* Alerts */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">
                Complaint Title{" "}
                <span style={{ color: "var(--error)" }}>
                  *
                </span>
              </label>

              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Water leak in bathroom"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Room Number */}
            <div className="form-group">
              <label htmlFor="roomNumber">
                Room Number{" "}
                <span style={{ color: "var(--error)" }}>
                  *
                </span>
              </label>

              <input
                id="roomNumber"
                type="text"
                name="roomNumber"
                placeholder="e.g. 101"
                value={formData.roomNumber}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">
                  — Select Category —
                </option>

                {CATEGORIES.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">
                Description{" "}
                <span style={{ color: "var(--error)" }}>
                  *
                </span>
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe the issue..."
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />

              <div className="role-info">
                {formData.description.length}/1000
                characters
              </div>
            </div>

            <div className="divider"></div>

            {/* Buttons */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit Complaint"}
              </button>

              <Link
                to="/dashboard"
                className="btn btn-outline"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}