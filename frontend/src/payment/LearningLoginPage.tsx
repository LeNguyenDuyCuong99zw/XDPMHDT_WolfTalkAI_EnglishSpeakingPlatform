import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LearningLoginPage.css';

interface LearningLoginPageProps {}

export const LearningLoginPage: React.FC<LearningLoginPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Get message from navigation state (if any)
  const welcomeMessage = location.state?.message;

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      // Already logged in, check if placement test is done
      const userData = JSON.parse(user);
      if (userData.hasCompletedPlacementTest) {
        navigate('/dashboard');
      } else {
        navigate('/placement-test');
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Vui lòng nhập đầy đủ email và mật khẩu');
      }

      // Call login API
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const data = await response.json();

      // Save to localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Check if user has completed placement test
      if (data.user.hasCompletedPlacementTest) {
        // Go to dashboard
        navigate('/dashboard');
      } else {
        // Go to placement test
        navigate('/placement-test', {
          state: {
            message: 'Vui lòng hoàn thành bài test đánh giá để bắt đầu học tập'
          }
        });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="learning-login-page">
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="logo">
              <span className="logo-icon">🎓</span>
              <h1>WolfTalk</h1>
              <p className="tagline">Learning Platform</p>
            </div>
            
            <div className="welcome-section">
              <h2>Chào Mừng Đến Với Nền Tảng Học Tập!</h2>
              <p>Bắt đầu hành trình chinh phục tiếng Anh của bạn</p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Học tập cá nhân hóa</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Mentor hỗ trợ 1-1</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Theo dõi tiến độ</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Chứng chỉ hoàn thành</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Đăng Nhập</h2>
              <p>Truy cập vào nền tảng học tập của bạn</p>
            </div>

            {welcomeMessage && (
              <div className="welcome-banner">
                <span className="banner-icon">🎉</span>
                <p>{welcomeMessage}</p>
              </div>
            )}

            {error && (
              <div className="error-banner">
                <span className="error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="forgot-password">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="btn-login"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng Nhập'
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>
                Chưa có tài khoản?{' '}
                <a href="/packages/1" className="signup-link">
                  Đăng ký ngay
                </a>
              </p>
            </div>

            <div className="demo-credentials">
              <p className="demo-title">🔑 Demo Accounts:</p>
              <div className="demo-accounts">
                <div className="demo-account">
                  <strong>Admin:</strong> admin@wolftalk.com / Admin@123456
                </div>
                <div className="demo-account">
                  <strong>Mentor:</strong> mentor@wolftalk.com / Mentor@123456
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningLoginPage;
