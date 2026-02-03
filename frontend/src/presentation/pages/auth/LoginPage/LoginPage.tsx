import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../../../components/atoms/Button/Button";
import { Input } from "../../../components/atoms/Input/Input";
import "./LoginPage.css";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // HOOKS PHẢI Ở ĐÂY
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login({ email, password }); // <-- user trả về từ use case
      console.log("User from login():", user);

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "MENTOR") {
        navigate("/mentor/dashboard");
      } else if (user.role === "USER") {
        navigate("/learner/dashboard");
      } else {
        navigate("/learner/dashboard");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <span className="logo-icon">🏫</span>
            </div>
            <h1 className="login-title">AESP Portal</h1>
            <p className="login-subtitle">Admin & Mentor Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              type="email"
              label="Email Address"
              placeholder="admin@aesp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              disabled={isLoading}
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              disabled={isLoading}
            />

            {error && (
              <div className="login-error">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="login-footer">
            <p className="login-help">
              Need help? Contact{" "}
              <a href="mailto:support@aesp.com">support@aesp.com</a>
            </p>
          </div>
        </div>

        <div className="login-background">
          <div className="bg-circle bg-circle-1"></div>
          <div className="bg-circle bg-circle-2"></div>
          <div className="bg-circle bg-circle-3"></div>
        </div>
      </div>
    </div>
  );
};
