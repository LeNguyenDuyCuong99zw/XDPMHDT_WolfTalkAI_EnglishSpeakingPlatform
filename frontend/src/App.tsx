import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { apiClient } from "./services/api";

interface HealthResponse {
  status: string;
  message: string;
  timestamp: number;
}

interface HelloResponse {
  message: string;
  version: string;
}

function App() {
  const [count, setCount] = useState(0);
  const [backendStatus, setBackendStatus] = useState<string>("Checking...");
  const [backendMessage, setBackendMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiClient.get<HealthResponse>("/health");
      setBackendStatus(data.status);
      setBackendMessage(data.message);
    } catch (err) {
      setError("❌ Backend not connected");
      setBackendStatus("DOWN");
    } finally {
      setLoading(false);
    }
  };

  const getHello = async () => {
    try {
      setError("");
      const data = await apiClient.get<HelloResponse>("/hello");
      setBackendMessage(data.message);
    } catch (err) {
      setError("Error fetching hello message");
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WolfTalk - Frontend & Backend Connected</h1>

      <div className="card">
        <h2>Backend Status</h2>
        <p>
          Status:{" "}
          <strong style={{ color: backendStatus === "UP" ? "green" : "red" }}>
            {backendStatus}
          </strong>
        </p>
        <p>{backendMessage}</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={checkBackendHealth} disabled={loading}>
          {loading ? "Checking..." : "Check Backend Health"}
        </button>
      </div>

      <div className="card">
        <button onClick={getHello}>Get Hello Message from Backend</button>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  );
}

export default App;
