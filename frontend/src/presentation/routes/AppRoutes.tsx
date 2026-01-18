import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "../pages/auth/LoginPage/LoginPage";
import { DashboardPage } from "../pages/admin/DashboardPage/DashboardPage";
import { UsersPage } from "../pages/admin/UsersPage/UsersPage";
import { MentorsPage } from "../pages/admin/MentorsPage/MentorsPage";
import { PlansPage } from "../pages/admin/PlansPage/PlansPage";
import { TransactionsPage } from "../pages/admin/TransactionsPage/TransactionsPage";
import { ModerationPage } from "../pages/admin/ModerationPage/ModerationPage";
import { SupportPage } from "../pages/admin/SupportPage/SupportPage";
import { PolicyPage } from "../pages/admin/PolicyPage/PolicyPage";
import { AdminLayout } from "../components/templates/AdminLayout/AdminLayout";
import { LearnersPage } from "../pages/mentor/LearnersPage/LearnersPage";
import { AssessmentPage } from "../pages/mentor/AssessmentPage/AssessmentPage";
import { FeedbackPage } from "../pages/mentor/FeedbackPage/FeedbackPage";
import { MaterialsPage } from "../pages/mentor/MaterialsPage/MaterialsPage";
import { SharedExperiencePage } from "../pages/mentor/SharedExperiencePage/SharedExperiencePage";
import { PrivateRoute } from "./PrivateRoute";
import { MentorLayout } from "../components/templates/MentorLayout/MentorLayout";
import { MentorDashboardPage } from "../pages/mentor/MentorDashboardPage/MentorDashboardPage";
import { ConversationPracticePage } from "../pages/mentor/ConversationPracticePage/ConversationPracticePage";
import { LiveSessionPage } from "../pages/mentor/LiveSessionPage/LiveSessionPage";
import { ProgressTrackingPage } from "../pages/mentor/ProgressTrackingPage/ProgressTrackingPage";
import { PronunciationAnalysisPage } from "../pages/mentor/PronunciationAnalysisPage/PronunciationAnalysisPage"
import { VocabularyManagementPage } from "../pages/mentor/VocabularyManagementPage/VocabularyManagementPage";
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminLayout>
              <UsersPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/mentors"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminLayout>
              <MentorsPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/plans"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminLayout>
              <PlansPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminLayout>
              <TransactionsPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/moderation"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminLayout>
              <ModerationPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/support"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminLayout>
              <SupportPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/policys"
        element={
          <PrivateRoute requiredRole="Admin">
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
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <MentorDashboardPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/learners"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <LearnersPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/assessment"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <AssessmentPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/feedback"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <FeedbackPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/materials"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <MaterialsPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/sharedexperience"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <SharedExperiencePage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/conversationpractice"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <ConversationPracticePage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/livesession"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <LiveSessionPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/progresstracking"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <ProgressTrackingPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/pronunciationanalysis"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <PronunciationAnalysisPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/mentor/vocabularymanagement"
        element={
          <PrivateRoute requiredRole="Mentor">
            <MentorLayout>
              <VocabularyManagementPage />
            </MentorLayout>
          </PrivateRoute>
        }
      />
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
