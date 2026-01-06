import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProfilePage from "./profile/ProfilePage";
import CertificatesPage from "./certificat/CertificatesPage";
import ProgressPage from "./progress/ProgressPage";
import "./App.css";
import DashboardPage from "./dashboard/DashboardPage";
import LandingPage from "./pages/LandingPage";
import {
  PlacementTestLanding,
  PlacementTestSteps,
  PlacementTestComplete,
} from "./placement-test";

function App() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  return (
    <Router>
      {token ? (
        <Routes>
          {/* Placement Test Routes - Full Screen without Sidebar */}
          <Route path="/placement-test" element={<PlacementTestLanding />} />
          <Route
            path="/placement-test/:testId/step/:stepNumber"
            element={<PlacementTestSteps />}
          />
          <Route
            path="/placement-test/:testId/complete"
            element={<PlacementTestComplete />}
          />

          {/* Dashboard Routes - With Sidebar */}
          <Route
            path="/*"
            element={
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Routes>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route
                      path="/certificates"
                      element={<CertificatesPage />}
                    />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </main>
              </div>
            }
          />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
