import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import RequirePlacementTest from "./components/RequirePlacementTest";
import ProfilePage from "./profile/ProfilePage";
import ProfileSettings from "./profile/ProfileSettings";
import CertificatesPage from "./certificat/CertificatesPage";
import ProgressPage from "./progress/ProgressPage";
import AlphabetPage from "./alphabet/AlphabetPage";
import AlphabetQuiz from "./alphabet/AlphabetQuiz";
import "./App.css";
import DashboardPage from "./dashboard/DashboardPage";
import LandingPage from "./pages/LandingPage";
import {
  PlacementTestLanding,
  PlacementTestSteps,
  PlacementTestComplete,
} from "./placement-test";
import PlacementTestQuestions from "./placement-test/PlacementTestQuestions";
import LearningPage from "./presentation/learning/pages/LearningPage";
import PackageSelectionPage from "./pages/PackageSelectionPage";

import SubscriptionPage from "./pages/SubscriptionPage";
import ChatPage from "./pages/ChatPage";
import { OAuthCallback } from "./presentation/pages/auth/OAuthCallback";
import { LoginPage } from "./presentation/pages/auth/LoginPage/LoginPage";

function App() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return (
    <Router>
      <Routes>
        {/* Landing Page - Always accessible, no authentication required */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/login" element={<LoginPage />} />

        {token ? (
          <>
            {/* Placement Test Routes - Full Screen without Sidebar */}
            <Route path="/placement-test" element={<PlacementTestLanding />} />
            <Route
              path="/placement-test/:testId/step/:stepNumber"
              element={<PlacementTestSteps />}
            />
            <Route
              path="/placement-test/:testId/questions"
              element={<PlacementTestQuestions />}
            />
            <Route
              path="/placement-test/:testId/complete"
              element={<PlacementTestComplete />}
            />

            {/* Alphabet Quiz - Full Screen without Sidebar */}
            <Route path="/alphabet/quiz" element={<AlphabetQuiz />} />

            {/* DIRECT ACCESS TO LEARNING (Bypassing Placement Test for Testing) */}
            <Route
              path="/learning/*"
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <LearningPage />
                  </main>
                </div>
              }
            />

            {/* Package & Subscription Routes - Full Screen */}
            <Route
              path="/packages/:userId"
              element={<PackageSelectionPage />}
            />
            <Route
              path="/subscriptions/:userId"
              element={<SubscriptionPage />}
            />

            {/* Dashboard Routes - With Sidebar - Protected by Placement Test */}
            <Route
              path="/profile"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <ProfilePage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/profile/settings"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <ProfileSettings />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <DashboardPage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/alphabet"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <AlphabetPage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/certificates"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <CertificatesPage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/progress"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <ProgressPage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/chat"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <ChatPage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
