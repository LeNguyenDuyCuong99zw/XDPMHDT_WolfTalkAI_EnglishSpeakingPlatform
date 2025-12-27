import React, { useState } from "react";
import "../styles/AgeSelectionPage.css";
import logoWolf from "../assets/wolftalk/logo_wolf.png";

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
}

const SignUp: React.FC<SignUpProps> = ({
  displayLanguage,
  onClose,
  onSignUp,
  onNext,
}) => {
  const [age, setAge] = useState("");

  const content = translations[displayLanguage];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Next with age:", age);
    onNext();
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign up clicked");
  };

  const handleFacebookSignUp = () => {
    console.log("Facebook sign up clicked");
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

          <form onSubmit={handleNext} className="age-form">
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
