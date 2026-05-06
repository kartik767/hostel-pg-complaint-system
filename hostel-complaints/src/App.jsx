import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateComplaint from "./pages/CreateComplaint.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// Helper: check if user is logged in
function isLoggedIn() {
  return !!localStorage.getItem("token");
}

// Helper: get user role from localStorage
function getUserRole() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role || "";
}

// ProtectedRoute: redirects to login if not authenticated
function ProtectedRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// AdminRoute: only allows admin users
function AdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (getUserRole() !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes for regular users */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-complaint"
        element={
          <ProtectedRoute>
            <CreateComplaint />
          </ProtectedRoute>
        }
      />

      {/* Admin only route */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
