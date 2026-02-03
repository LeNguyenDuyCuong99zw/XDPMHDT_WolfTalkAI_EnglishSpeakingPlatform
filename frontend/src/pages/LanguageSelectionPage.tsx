import React, { useEffect, useState } from "react";
import "../styles/LanguageSelectionPage.css";
import logoWolf from "../assets/wolftalk/logo_wolf.png";

type Language = "vi" | "en" | "fr" | "es";

interface TextContent {
  title: string;
  backButton: string;
}

interface LanguageCard {
  id: string;
  nameVi: string;
  nameEn: string;
  flag: string;
  learners: string;
}

const languages: LanguageCard[] = [
  {
    id: "en",
    nameVi: "Tiếng Anh",
    nameEn: "English",
    flag: "🇺🇸",
    learners: "11,7 Tr người học",
  },
  {
    id: "ja",
    nameVi: "Tiếng Nhật",
    nameEn: "Japanese",
    flag: "🇯🇵",
    learners: "247 N người học",
  },
  {
    id: "zh",
    nameVi: "Tiếng Trung",
    nameEn: "Chinese",
    flag: "🇨🇳",
    learners: "2,86 Tr người học",
  },
];

const translations: Record<Language, TextContent> = {
  vi: {
    title: "Tôi muốn học...",
    backButton: "← Quay lại",
  },
  en: {
    title: "I want to learn...",
    backButton: "← Back",
  },
  fr: {
    title: "Je veux apprendre...",
    backButton: "← Retour",
  },
  es: {
    title: "Quiero aprender...",
    backButton: "← Atrás",
  },
};

interface LanguageSelectionPageProps {
  displayLanguage: Language;
  onBack: () => void;
  onSelectLanguage: (languageId: string) => void;
}

const LanguageSelectionPage: React.FC<LanguageSelectionPageProps> = ({
  displayLanguage,
  onBack,
  onSelectLanguage,
}) => {
  const [showFirework, setShowFirework] = useState(false);
  const [fireworkSrc, setFireworkSrc] = useState("");

  useEffect(() => {
    // Load Lottie player script
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.11/dist/dotlottie-wc.js";
    script.type = "module";
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const content = translations[displayLanguage];

  const getLanguageName = (card: LanguageCard): string => {
    return displayLanguage === "vi" ? card.nameVi : card.nameEn;
  };

  const handleLanguageClick = (languageId: string) => {
    let animationUrl = "";

    if (languageId === "en") {
      animationUrl =
        "https://lottie.host/0cc6b5c5-da2d-418b-b50f-b59fdf654d43/XHtHad0OA5.lottie";
    } else if (languageId === "ja") {
      animationUrl =
        "https://lottie.host/6822bccf-7bc3-464e-b5de-03db0089ccdc/H5WhPcXfpq.lottie";
    } else if (languageId === "zh") {
      animationUrl =
        "https://lottie.host/641ab403-6cab-46b6-b266-a2abf969c2c7/N90bSmc24f.lottie";
    }

    if (animationUrl) {
      setFireworkSrc(animationUrl);
      setShowFirework(true);
      setTimeout(() => {
        setShowFirework(false);
        onSelectLanguage(languageId);
      }, 3000);
    } else {
      onSelectLanguage(languageId);
    }
  };

  return (
    <div className="language-selection-page">
      {/* Header */}
      <header className="selection-header">
        <div className="selection-header-container">
          <button className="back-button" onClick={onBack}>
            {content.backButton}
          </button>
          <div className="landing-logo">
            <img src={logoWolf} alt="WolfTalk Logo" className="logo-wolf" />
            <span className="logo-text">WolfTalk</span>
          </div>
          <div className="header-placeholder"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="selection-main-content">
        <h1 className="selection-title">{content.title}</h1>

        <div className="language-grid">
          {languages.map((language) => (
            <div
              key={language.id}
              className="language-card"
              onClick={() => handleLanguageClick(language.id)}
            >
              <div className="flag-container">
                {language.id === "ja" ? (
                  <dotlottie-wc
                    src="https://lottie.host/9d009d6b-db24-459b-ab51-38dc98e2bace/3JyjHrfZcf.lottie"
                    style={{ width: "96px", height: "96px" }}
                    autoplay
                    loop
                  />
                ) : language.id === "en" ? (
                  <dotlottie-wc
                    src="https://lottie.host/9066490f-dffe-4102-be47-cd8a345713f9/7fSapcMFgT.lottie"
                    style={{ width: "96px", height: "96px" }}
                    autoplay
                    loop
                  />
                ) : language.id === "zh" ? (
                  <dotlottie-wc
                    src="https://lottie.host/2ea6ae14-496b-4fc3-a4e8-827cd3bdc6b4/UV0fGYaNxN.lottie"
                    style={{ width: "96px", height: "96px" }}
                    autoplay
                    loop
                  />
                ) : (
                  language.flag
                )}
              </div>
              <h3 className="card-language-name">
                {getLanguageName(language)}
              </h3>
              <p className="card-learners">{language.learners}</p>
            </div>
          ))}
        </div>
      </main>

      {/* City Animation */}
      <div className="city-animation">
        <dotlottie-wc
          src="https://lottie.host/09dd5f1c-069c-47b6-9c87-879312c9cad0/FU8omlExph.lottie"
          style={{ width: "450px", height: "450px" }}
          autoplay
          loop
        />
      </div>

      {/* Left Bottom Animation */}
      <div className="left-animation">
        <dotlottie-wc
          src="https://lottie.host/ef5176b6-49e8-475d-bf6c-6b34ebf47f56/5xseQS1V3I.lottie"
          style={{ width: "475px", height: "475px" }}
          autoplay
          loop
        />
      </div>

      {/* Firework Animation */}
      {showFirework && (
        <>
          <div className="firework-backdrop"></div>
          <div className="firework-animation">
            <dotlottie-wc
              src={fireworkSrc}
              style={{ width: "600px", height: "600px" }}
              autoplay
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelectionPage;
