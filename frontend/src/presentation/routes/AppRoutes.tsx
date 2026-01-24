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
import { PronunciationAnalysisPage } from "../pages/mentor/PronunciationAnalysisPage/PronunciationAnalysisPage";
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
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
