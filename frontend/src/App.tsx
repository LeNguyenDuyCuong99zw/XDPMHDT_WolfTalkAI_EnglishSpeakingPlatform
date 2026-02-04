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
import ListeningChallengePage from "./pages/ListeningChallengePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import QuestsPage from "./pages/QuestsPage";
import PracticePage from "./pages/LearningPage";
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
import PaymentPage from "./payment/PaymentPage";
import PaymentSuccessPage from "./payment/PaymentSuccessPage";
import LearningLoginPage from "./payment/LearningLoginPage";
import { LearnerLayout } from "./presentation/components/templates/LearnerLayout/LearnerLayout";
import { LearnerDashboardPage } from "./presentation/pages/learner/LearnerDashboardPage/LearnerDashboardPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import ChatPage from "./pages/ChatPage";
import { OAuthCallback } from "./presentation/pages/auth/OAuthCallback";
import { LoginPage } from "./presentation/pages/auth/LoginPage/LoginPage";
import VocabularyLearningPage from "./presentation/vocabulary/pages/VocabularyLearningPage";
import GrammarCheckerPage from "./pages/GrammarCheckerPage";
import AIConversationPage from "./pages/AIConversationPage";
import VocabularyPage from "./pages/VocabularyLearningPage";
import WritingPracticePage from "./pages/WritingPracticePage";
import ReadingComprehensionPage from "./pages/ReadingComprehensionPage";
import GrammarExercisesPage from "./pages/GrammarExercisesPage";
import AILearningIndexPage from "./pages/AILearningIndexPage";
import { PronunciationPractice } from "./pronunciation";
import { LearnerAssessmentsPage } from "./presentation/pages/learner/LearnerAssessmentsPage/LearnerAssessmentsPage";
import { TakeAssessmentPage } from "./presentation/pages/learner/TakeAssessmentPage/TakeAssessmentPage";
import { AssessmentResultPage } from "./presentation/pages/learner/AssessmentResultPage/AssessmentResultPage";

import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("accessToken"));
    };

    // Listen for storage events (including custom dispatched ones)
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Landing Page - Always accessible, no authentication required */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/learning/login" element={<LearningLoginPage />} />

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

            {/* Pronunciation Practice - With Sidebar */}
            <Route 
              path="/pronunciation-practice" 
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <PronunciationPractice />
                  </main>
                </div>
              } 
            />
            <Route 
              path="/pronunciation" 
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <PronunciationPractice />
                  </main>
                </div>
              } 
            />

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

            {/* Payment Routes - Full Screen */}
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />

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
              path="/learner/dashboard"
              element={
                <LearnerLayout>
                  <LearnerDashboardPage />
                </LearnerLayout>
              }
            />
            <Route
              path="/learner/assessments"
              element={
                <LearnerLayout>
                  <LearnerAssessmentsPage />
                </LearnerLayout>
              }
            />
            <Route
              path="/learner/assessment/:assessmentId/take"
              element={
                <TakeAssessmentPage />
              }
            />
            <Route
              path="/learner/assessment/:attemptId/result"
              element={
                <AssessmentResultPage />
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
              path="/listening"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <ListeningChallengePage />
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

            {/* AI Learning Routes */}
            <Route
              path="/ai"
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <AILearningIndexPage />
                  </main>
                </div>
              }
            />
            <Route
              path="/ai/grammar"
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <GrammarCheckerPage />
                  </main>
                </div>
              }
            />
            <Route
              path="/ai/conversation"
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <AIConversationPage />
                  </main>
                </div>
              }
            />
            <Route
              path="/ai/vocabulary"
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <VocabularyPage />
                  </main>
                </div>
              }
            />
            <Route
              path="/ai/writing"
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <WritingPracticePage />
                  </main>
                </div>
              }
            />
            <Route
              path="/ai/reading"
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <ReadingComprehensionPage />
                  </main>
                </div>
              }
            />
            <Route
              path="/ai/exercises"
              element={
                <div className="app-layout">
                  <Sidebar />
                  <main className="main-content">
                    <GrammarExercisesPage />
                  </main>
                </div>
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
            <Route
              path="/leaderboard"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <LeaderboardPage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/quests"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <QuestsPage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/practice"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <PracticePage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/vocabulary"
              element={
                <RequirePlacementTest>
                  <VocabularyLearningPage />
                </RequirePlacementTest>
              }
            />
            <Route
              path="/ai/grammar"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <GrammarCheckerPage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/ai/conversation"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <AIConversationPage />
                    </main>
                  </div>
                </RequirePlacementTest>
              }
            />
            <Route
              path="/ai/vocabulary"
              element={
                <RequirePlacementTest>
                  <div className="app-layout">
                    <Sidebar />
                    <main className="main-content">
                      <VocabularyPage />
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
