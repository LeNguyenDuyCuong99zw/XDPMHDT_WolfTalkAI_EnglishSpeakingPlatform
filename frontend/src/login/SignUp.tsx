import React, { useState } from "react";
import "../styles/AgeSelectionPage.css";
import logoWolf from "../assets/wolftalk/logo_wolf.png";
import { apiClient } from "../services/api";

type Language = "vi" | "en" | "fr" | "es";

interface TextContent {
  title: string;
  ageInputPlaceholder: string;
  description: string;
  privacyText: string;
  nextButton: string;
  orText: string;
  googleButton: string;
  facebookButton: string;
  signUpButton: string;
  backButton: string;
}

const translations: Record<Language, TextContent> = {
  vi: {
    title: "Bạn bao nhiêu tuổi?",
    ageInputPlaceholder: "Tuổi",
    description:
      "Hãy cho chúng tôi biết tuổi của bạn để có trải nghiệm học Duolingo phù hợp nhất. Vui lòng truy cập trang Chính sách quyền riêng tư của chúng tôi để biết thêm chi tiết.",
    privacyText: "Chính sách quyền riêng tư",
    nextButton: "TIẾP THEO",
    orText: "HOẶC",
    googleButton: "GOOGLE",
    facebookButton: "FACEBOOK",
    signUpButton: "ĐĂNG KÝ",
    backButton: "← Quay lại",
  },
  en: {
    title: "How old are you?",
    ageInputPlaceholder: "Age",
    description:
      "Tell us your age so we can create the best Duolingo learning experience for you. Please visit our Privacy Policy page to learn more.",
    privacyText: "Privacy Policy",
    nextButton: "NEXT",
    orText: "OR",
    googleButton: "GOOGLE",
    facebookButton: "FACEBOOK",
    signUpButton: "SIGN UP",
    backButton: "← Back",
  },
  fr: {
    title: "Quel âge avez-vous?",
    ageInputPlaceholder: "Âge",
    description:
      "Dites-nous votre âge pour que nous puissions créer la meilleure expérience d'apprentissage Duolingo pour vous. Veuillez consulter notre page Politique de confidentialité pour en savoir plus.",
    privacyText: "Politique de confidentialité",
    nextButton: "SUIVANT",
    orText: "OU",
    googleButton: "GOOGLE",
    facebookButton: "FACEBOOK",
    signUpButton: "S'INSCRIRE",
    backButton: "← Retour",
  },
  es: {
    title: "¿Cuántos años tienes?",
    ageInputPlaceholder: "Edad",
    description:
      "Cuéntanos tu edad para que podamos crear la mejor experiencia de aprendizaje de Duolingo para ti. Visita nuestra página de Política de privacidad para obtener más información.",
    privacyText: "Política de privacidad",
    nextButton: "SIGUIENTE",
    orText: "O",
    googleButton: "GOOGLE",
    facebookButton: "FACEBOOK",
    signUpButton: "REGISTRARSE",
    backButton: "← Atrás",
  },
};

interface SignUpProps {
  displayLanguage: Language;
  onClose: () => void;
  onSignUp: () => void;
  onNext: () => void;
  learningLanguage?: string;
}

const SignUp: React.FC<SignUpProps> = ({
  displayLanguage,
  onClose,
  onSignUp,
  onNext,
  learningLanguage,
}) => {
  const [step, setStep] = useState<number>(1);
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const content = translations[displayLanguage];

  const handleAgeNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || Number(age) < 1) {
      alert("Vui lòng nhập tuổi hợp lệ");
      return;
    }
    setStep(2);
  };

  const validateAccount = () => {
    if (!email) {
      alert("Vui lòng nhập email");
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert("Email không hợp lệ");
      return false;
    }
    if (!password || password.length < 6) {
      alert("Mật khẩu phải ít nhất 6 ký tự");
      return false;
    }
    return true;
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAccount()) return;

    setError("");
    setIsLoading(true);

    const payload: any = {
      email,
      password,
      firstName,
      lastName,
      age,
      learningLanguage: learningLanguage || "en",
    };

    try {
      const res = await apiClient.post<{ token: string }>(
        "/auth/register",
        payload,
      );
      localStorage.setItem("accessToken", res.token);
      setStep(3);
      setTimeout(() => onNext(), 800);
    } catch (err: any) {
      console.error("Register failed", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Đăng ký thất bại";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    const url1 = "/placement-test"; // URL sau khi signup thành công
    const googleAuthUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      "?scope=email%20profile%20openid" +
      `&redirect_uri=${window.location.origin}${url1}` +
      "&response_type=code" +
      "&client_id=105737070633-e5po00frvcelb1oj88jis6lfd1q7coqj.apps.googleusercontent.com" +
      "&prompt=consent";
    window.location.href = googleAuthUrl;
  };

  const handleFacebookSignUp = () => {
    const fbClientId = "YOUR_FACEBOOK_APP_ID";
    const url1 = "/placement-test"; // URL sau khi signup thành công
    const facebookAuthUrl =
      "https://www.facebook.com/v18.0/dialog/oauth" +
      `?client_id=${fbClientId}` +
      `&redirect_uri=${window.location.origin}${url1}` +
      "&scope=email,public_profile" +
      "&response_type=code";
    window.location.href = facebookAuthUrl;
  };

  return (
    <div className="age-page">
      {/* Header */}
      <header className="age-header">
        <div className="age-header-container">
          <button className="age-back-button" onClick={onClose}>
            {content.backButton}
          </button>
          <div className="logo">
            <img src={logoWolf} alt="WolfTalk Logo" className="logo-wolf" />
            <span className="logo-text">WolfTalk</span>
          </div>
          <button className="age-signup-btn" onClick={onSignUp}>
            {content.signUpButton}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="age-main-content">
        <div className="age-form-container">
          <h1 className="age-title">{content.title}</h1>

          {step === 1 && (
            <form onSubmit={handleAgeNext} className="age-form">
              <div className="age-form-group">
                <input
                  type="number"
                  placeholder={content.ageInputPlaceholder}
                  className="age-input"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                  required
                />
              </div>

              <p className="age-description">
                {content.description.split(content.privacyText)[0]}
                <a href="#" className="privacy-link">
                  {content.privacyText}
                </a>
                {content.description.split(content.privacyText)[1]}
              </p>

              <button type="submit" className="age-next-button">
                {content.nextButton}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleCreateAccount} className="age-form">
              {error && (
                <div
                  className="error-message"
                  style={{
                    backgroundColor: "#fee",
                    border: "1px solid #fcc",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "16px",
                    color: "#c33",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              <div className="age-form-group">
                <input
                  className="age-input"
                  type="text"
                  placeholder="First name (optional)"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isLoading}
                />
                <input
                  className="age-input"
                  type="text"
                  placeholder="Last name (optional)"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ marginTop: 8 }}
                  disabled={isLoading}
                />
                <input
                  id="su-email"
                  className="age-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ marginTop: 8 }}
                  required
                  disabled={isLoading}
                />
                <input
                  id="su-password"
                  className="age-input"
                  type="password"
                  placeholder="Password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ marginTop: 8 }}
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className="age-next-button"
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.6 : 1 }}
              >
                {isLoading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="age-form success">
              <h3>Đăng ký thành công!</h3>
              <p>Bạn sẽ được chuyển hướng trong giây lát...</p>
            </div>
          )}

          <div className="age-divider">
            <span>{content.orText}</span>
          </div>

          <div className="age-social-buttons">
            <button
              className="age-social-btn google-btn"
              onClick={handleGoogleSignUp}
            >
              <span className="google-icon">G</span>
              {content.googleButton}
            </button>
            <button
              className="age-social-btn facebook-btn"
              onClick={handleFacebookSignUp}
            >
              <span className="facebook-icon">f</span>
              {content.facebookButton}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
