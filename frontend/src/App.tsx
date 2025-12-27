import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import { HealthCheckPage } from "./pages/HealthCheckPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/connect" element={<HealthCheckPage />} />
      </Routes>
    </Router>
  );
}

export default App;
