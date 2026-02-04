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

// Mentor imports
import { MentorLayout } from "./presentation/components/templates/MentorLayout/MentorLayout";
import { MentorDashboardPage } from "./presentation/pages/mentor/MentorDashboardPage/MentorDashboardPage";
import { LearnersPage } from "./presentation/pages/mentor/LearnersPage/LearnersPage";
import { AssessmentPage } from "./presentation/pages/mentor/AssessmentPage/AssessmentPage";
import { FeedbackPage } from "./presentation/pages/mentor/FeedbackPage/FeedbackPage";
import { MaterialsPage } from "./presentation/pages/mentor/MaterialsPage/MaterialsPage";
import { SharedExperiencePage } from "./presentation/pages/mentor/SharedExperiencePage/SharedExperiencePage";
import { ConversationPracticePage } from "./presentation/pages/mentor/ConversationPracticePage/ConversationPracticePage";
import { LiveSessionPage } from "./presentation/pages/mentor/LiveSessionPage/LiveSessionPage";
import { ProgressTrackingPage } from "./presentation/pages/mentor/ProgressTrackingPage/ProgressTrackingPage";
import { PronunciationAnalysisPage } from "./presentation/pages/mentor/PronunciationAnalysisPage/PronunciationAnalysisPage";

import { VocabularyManagementPage } from "./presentation/pages/mentor/VocabularyManagementPage/VocabularyManagementPage";
import { GradingPage } from "./presentation/pages/mentor/GradingPage/GradingPage";

/**
 * Admin & Mentor routes for http://localhost:3001
 * This app supports both admin and mentor interfaces
 */
const AdminApp: React.FC = () => {
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

      {/* Mentor Routes */}
      <Route
        path="/mentor/dashboard"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <MentorDashboardPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/learners"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <LearnersPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/assessment"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <AssessmentPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/feedback"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <FeedbackPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/materials"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <MaterialsPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/sharedexperience"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <SharedExperiencePage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/conversationpractice"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <ConversationPracticePage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/livesession"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <LiveSessionPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/progresstracking"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <ProgressTrackingPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/pronunciationanalysis"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <PronunciationAnalysisPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/vocabularymanagement"
        element={
          <PrivateRoute requiredRole="MENTOR">
            <MentorLayout>
              <VocabularyManagementPage />
            </MentorLayout>
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

      {/* Default redirects - redirect based on user role */}
      <Route
        path="/"
        element={
          user && user.role === "ADMIN" ? (
            <Navigate to="/admin/dashboard" replace />
          ) : user && user.role === "MENTOR" ? (
            <Navigate to="/mentor/learners" replace />
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
          ) : user && user.role === "MENTOR" ? (
            <Navigate to="/mentor/learners" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AdminApp;
