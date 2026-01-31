import React from "react";
import { useAuth } from "./presentation/contexts/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./presentation/pages/auth/LoginPage/LoginPage";
import { DashboardPage } from "./presentation/pages/admin/DashboardPage/DashboardPage";
import { UsersPage } from "./presentation/pages/admin/UsersPage/UsersPage";
import { MentorsPage } from "./presentation/pages/admin/MentorsPage/MentorsPage";
import { PlansPage } from "./presentation/pages/admin/PlansPage/PlansPage";
import { TransactionsPage } from "./presentation/pages/admin/TransactionsPage/TransactionsPage";
import { ModerationPage } from "./presentation/pages/admin/ModerationPage/ModerationPage";
import { SupportPage } from "./presentation/pages/admin/SupportPage/SupportPage";
import { PolicyPage } from "./presentation/pages/admin/PolicyPage/PolicyPage";
import { AdminLayout } from "./presentation/components/templates/AdminLayout/AdminLayout";
import { PrivateRoute } from "./presentation/routes/PrivateRoute";

/**
 * Admin-only routes for http://admin.localhost:5173
 * This app only shows admin interface
 */
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes Only */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminLayout>
              <UsersPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/mentors"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminLayout>
              <MentorsPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/plans"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminLayout>
              <PlansPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminLayout>
              <TransactionsPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/moderation"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminLayout>
              <ModerationPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/support"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminLayout>
              <SupportPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/policys"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminLayout>
              <PolicyPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />

      {/* Unauthorized page */}
      <Route
        path="/unauthorized"
        element={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              backgroundColor: "#f5f5f5",
            }}
          >
            <h1
              style={{ fontSize: "48px", marginBottom: "20px", color: "#333" }}
            >
              403
            </h1>
            <p
              style={{ fontSize: "20px", color: "#666", marginBottom: "20px" }}
            >
              You do not have permission to access this admin area
            </p>
            <button
              onClick={() => (window.location.href = "/login")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0056d2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Back to Login
            </button>
          </div>
        }
      />

      {/* Default redirects - if admin is logged in and authorized, send to dashboard; otherwise send to login */}
      <Route
        path="/"
        element={
          user && user.role === "ADMIN" ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="*"
        element={
          user && user.role === "ADMIN" ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};
