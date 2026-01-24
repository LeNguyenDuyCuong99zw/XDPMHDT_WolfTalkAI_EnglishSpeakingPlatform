import React, { useState } from "react";
import "../styles/LoginPage.css";
import logoWolf from "../assets/wolftalk/logo_wolf.png";
import { apiClient } from "../services/api";

type Language = "vi" | "en" | "fr" | "es";

interface TextContent {
  title: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  loginButton: string;
  orText: string;
  googleButton: string;
  facebookButton: string;
  termsText: string;
  signUpButton: string;
  backButton: string;
}

const translations: Record<Language, TextContent> = {
  vi: {
    title: "Đăng nhập",
    emailPlaceholder: "Email hoặc tên đăng nhập",
    passwordPlaceholder: "Mật khẩu",
    forgotPassword: "QUÊN?",
    loginButton: "ĐĂNG NHẬP",
    orText: "HOẶC",
    googleButton: "GOOGLE",
    facebookButton: "FACEBOOK",
    termsText:
      "Khi đăng ký trên WolfTalk , bạn đã đồng ý với Các chính sách và Chính sách bảo mật của chúng tôi.",
    signUpButton: "ĐĂNG KÝ",
    backButton: "← Quay lại",
  },
  en: {
    title: "Log in",
    emailPlaceholder: "Email or username",
    passwordPlaceholder: "Password",
    forgotPassword: "FORGOT?",
    loginButton: "LOG IN",
    orText: "OR",
    googleButton: "GOOGLE",
    facebookButton: "FACEBOOK",
    termsText:
      "When signing up on WolfTalk , you agree to our Terms and Conditions and Privacy Policy.",
    signUpButton: "SIGN UP",
    backButton: "← Back",
  },
  fr: {
    title: "Connexion",
    emailPlaceholder: "Email ou nom d'utilisateur",
    passwordPlaceholder: "Mot de passe",
    forgotPassword: "OUBLIÉ?",
    loginButton: "SE CONNECTER",
    orText: "OU",
    googleButton: "GOOGLE",
    facebookButton: "FACEBOOK",
    termsText:
      "En s'inscrivant sur WolfTalk , vous acceptez nos Conditions générales et notre Politique de confidentialité.",
    signUpButton: "S'INSCRIRE",
    backButton: "← Retour",
  },
  es: {
    title: "Iniciar sesión",
    emailPlaceholder: "Correo electrónico o nombre de usuario",
    passwordPlaceholder: "Contraseña",
    forgotPassword: "¿OLVIDÓ?",
    loginButton: "INICIAR SESIÓN",
    orText: "O",
    googleButton: "GOOGLE",
    facebookButton: "FACEBOOK",
    termsText:
      "Al registrarse en WolfTalk , usted acepta nuestros Términos y condiciones y Política de privacidad.",
    signUpButton: "REGISTRARSE",
    backButton: "← Atrás",
  },
};

interface LoginPageProps {
  displayLanguage: Language;
  onBack: () => void;
  onSignUp: () => void;
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  displayLanguage,
  onBack,
  onSignUp,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const content = translations[displayLanguage];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    apiClient
      .post<{ token: string; isFirstLogin?: boolean }>("/auth/login", {
        email,
        password,
      })
      .then((res) => {
        localStorage.setItem("accessToken", res.token);
        // Set first login flag if it's the user's first login
        if (res.isFirstLogin === true) {
          sessionStorage.setItem("isFirstLogin", "true");
        } else {
          // Every subsequent login is a "welcome back"
          sessionStorage.setItem("isWelcomeBack", "true");
        }
        onLoginSuccess();
      })
      .catch((err) => {
        console.error("Login failed", err);
        alert("Đăng nhập thất bại: " + err.message);
      });
  };

  const handleGoogleLogin = () => {
    const url2 = "/dashboard"; // URL sau khi login thành công
    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      "?scope=email%20profile%20openid" +
      `&redirect_uri=${window.location.origin}${url2}` +
      "&response_type=code" +
      "&client_id=105737070633-e5po00frvcelb1oj88jis6lfd1q7coqj.apps.googleusercontent.com" +
      "&prompt=consent";
    window.location.href = googleAuthUrl;
  };

  const handleFacebookLogin = () => {
    const fbClientId = "YOUR_FACEBOOK_APP_ID";
    const url2 = "/dashboard"; // URL sau khi login thành công
    const facebookAuthUrl =
      "https://www.facebook.com/v18.0/dialog/oauth" +
      `?client_id=${fbClientId}` +
      `&redirect_uri=${window.location.origin}${url2}` +
      "&scope=email,public_profile" +
      "&response_type=code";
    window.location.href = facebookAuthUrl;
  };

  return (
    <div className="login-page">
      {/* Header */}
      <header className="login-header">
        <div className="login-header-container">
          <button className="back-button" onClick={onBack}>
            {content.backButton}
          </button>
          <div className="logo">
            <img src={logoWolf} alt="WolfTalk Logo" className="logo-wolf" />
            <span className="logo-text">WolfTalk</span>
          </div>
          <button className="signup-button" onClick={onSignUp}>
            {content.signUpButton}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-main-content">
        <div className="login-form-container">
          <h1 className="login-title">{content.title}</h1>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-form-group">
              <input
                type="email"
                placeholder={content.emailPlaceholder}
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-form-group">
              <div className="password-wrapper">
                <input
                  type="password"
                  placeholder={content.passwordPlaceholder}
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={() => console.log("Forgot password clicked")}
                >
                  {content.forgotPassword}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              {content.loginButton}
            </button>
          </form>

          <div className="login-divider">
            <span>{content.orText}</span>
          </div>

          <div className="social-login-buttons">
            <button
              className="social-btn google-btn"
              onClick={handleGoogleLogin}
            >
              <span className="google-icon">G</span>
              {content.googleButton}
            </button>
            <button
              className="social-btn facebook-btn"
              onClick={handleFacebookLogin}
            >
              <span className="facebook-icon">f</span>
              {content.facebookButton}
            </button>
          </div>

          <p className="login-terms-text">{content.termsText}</p>

          <p className="login-recaptcha-text">
            Trang này được reCAPTCHA Enterprise bảo hộ và theo Chính sách bảo
            mật và Điều khoản dịch vụ của Google.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
