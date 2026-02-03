import React, { useState } from "react";
import "../styles/LandingPage.css";
import logoWolf from "../assets/wolftalk/logo_wolf.png";
import LanguageSelectionPage from "./LanguageSelectionPage";
import WelcomeScreen1 from "./WelcomeScreen1";
import WelcomeScreen2 from "./WelcomeScreen2";
import LoginPage from "../login/LoginPage";
import SignUp from "../login/SignUp";

type Language = "vi" | "en" | "fr" | "es";

interface TextContent {
  mainTitle: string;
  freeText: string;
  buttonStart: string;
  buttonLogin: string;
  languageLabel: string;
}

const LandingPage: React.FC = () => {
  const [currentLanguageIndex, setCurrentLanguageIndex] = useState(0);
  const [displayLanguage, setDisplayLanguage] = useState<Language>("vi");
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [showWelcome1, setShowWelcome1] = useState(false);
  const [showWelcome2, setShowWelcome2] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const languages = [
    { name: "TIẾNG ANH", flag: "🇺🇸" },
    { name: "TIẾNG PHÁP", flag: "🇫🇷" },
    { name: "TIẾNG SPANISH", flag: "🇪🇸" },
    { name: "TIẾNG ĐỨC", flag: "🇩🇪" },
  ];

  const translations: Record<Language, TextContent> = {
    vi: {
      mainTitle: "Học ngoại ngữ",
      freeText: "miễn phí",
      buttonStart: "BẮT ĐẦU",
      buttonLogin: "TÔI ĐÃ CÓ TÀI KHOẢN",
      languageLabel: "NGÔN NGỮ HIỂN THỊ:",
    },
    en: {
      mainTitle: "Learn a language",
      freeText: "for free",
      buttonStart: "GET STARTED",
      buttonLogin: "I ALREADY HAVE AN ACCOUNT",
      languageLabel: "DISPLAY LANGUAGE:",
    },
    fr: {
      mainTitle: "Apprenez une langue",
      freeText: "gratuitement",
      buttonStart: "COMMENCER",
      buttonLogin: "J'AI DÉJÀ UN COMPTE",
      languageLabel: "LANGUE D'AFFICHAGE:",
    },
    es: {
      mainTitle: "Aprende un idioma",
      freeText: "de forma gratuita",
      buttonStart: "EMPEZAR",
      buttonLogin: "YA TENGO UNA CUENTA",
      languageLabel: "IDIOMA DE VISUALIZACIÓN:",
    },
  };

  const handlePrevLanguage = () => {
    setCurrentLanguageIndex(
      currentLanguageIndex === 0
        ? languages.length - 1
        : currentLanguageIndex - 1,
    );
  };

  const handleNextLanguage = () => {
    setCurrentLanguageIndex(
      currentLanguageIndex === languages.length - 1
        ? 0
        : currentLanguageIndex + 1,
    );
  };

  const handleDisplayLanguageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedLanguage = e.target.value as Language;
    setDisplayLanguage(selectedLanguage);
  };

  const content = translations[displayLanguage];

  const handleStartClick = () => {
    setShowLanguageSelection(true);
  };

  const handleBackFromSelection = () => {
    setShowLanguageSelection(false);
  };

  const handleSelectLanguage = (languageId: string) => {
    console.log("Selected language:", languageId);
    setSelectedLanguage(languageId);
    setShowLanguageSelection(false);
    setShowWelcome1(true);
  };

  const handleWelcome1Next = () => {
    setShowWelcome1(false);
    setShowWelcome2(true);
  };

  const handleWelcome2Next = () => {
    setShowWelcome2(false);
    setShowAgeModal(true);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  const handleSignUpClick = () => {
    setShowLoginModal(false);
    setShowAgeModal(true);
  };

  const handleCloseAge = () => {
    setShowAgeModal(false);
  };

  const handleLoginSuccess = () => {
    window.location.href = "/dashboard";
  };

  const handleAgeNext = () => {
    console.log("Age verification completed");
    setShowAgeModal(false);
    window.location.href = "/dashboard";
  };

  if (showLanguageSelection) {
    return (
      <LanguageSelectionPage
        displayLanguage={displayLanguage}
        onBack={handleBackFromSelection}
        onSelectLanguage={handleSelectLanguage}
      />
    );
  }

  if (showWelcome1) {
    return <WelcomeScreen1 onNext={handleWelcome1Next} />;
  }

  if (showWelcome2) {
    return <WelcomeScreen2 onNext={handleWelcome2Next} />;
  }

  if (showLoginModal) {
    return (
      <LoginPage
        displayLanguage={displayLanguage}
        onBack={handleCloseLogin}
        onSignUp={handleSignUpClick}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (showAgeModal) {
    return (
      <SignUp
        displayLanguage={displayLanguage}
        onClose={handleCloseAge}
        onSignUp={handleSignUpClick}
        onNext={handleAgeNext}
        learningLanguage={selectedLanguage}
      />
    );
  }

  return (
    <div className="landing-page">
      {/* ===== BANNER PHÍA TRÊN - GIỮ NGUYÊN ===== */}
      <header className="landing-header">
        <div className="landing-header-container">
          <div className="landing-logo">
            <img src={logoWolf} alt="WolfTalk Logo" className="landing-logo-wolf" />
            <span className="landing-logo-text">WolfTalk</span>
          </div>
          <div className="landing-language-selector">
            <label htmlFor="language-select">{content.languageLabel}</label>
            <select
              id="language-select"
              className="landing-language-dropdown"
              aria-label="Chọn ngôn ngữ hiển thị"
              value={displayLanguage}
              onChange={handleDisplayLanguageChange}
            >
              <option value="vi">TIẾNG VIỆT</option>
              <option value="en">TIẾNG ANH</option>
              <option value="fr">TIẾNG PHÁP</option>
              <option value="es">TIẾNG TÂY BAN NHA</option>
            </select>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT - GIỮ NGUYÊN ===== */}
      <main className="main-content">
        <div className="content-container">
          <div className="left-section">
            <div className="illustration">
              <div className="character character-5">
                <dotlottie-wc
                  src="https://lottie.host/411acd15-dcf8-4718-be63-792dfa66fb6d/C2vadCAOrZ.lottie"
                  speed="1"
                  style={{ width: "500px", height: "500px" }}
                  mode="forward"
                  loop
                  autoplay
                ></dotlottie-wc>
              </div>
            </div>
          </div>

          <div className="right-section">
            <h1 className="main-title">
              {content.mainTitle} <br />
              <span className="highlight">{content.freeText}</span>, vui nhộn{" "}
              <br />
              và hiểu quả!
            </h1>

            <div className="button-group">
              <button className="btn btn-primary" onClick={handleStartClick}>
                {content.buttonStart}
              </button>
              <button className="btn btn-secondary" onClick={handleLoginClick}>
                {content.buttonLogin}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ===== FEATURES CAROUSEL SECTION - GIỮ NGUYÊN ===== */}
      <section className="features-section">
        <div className="features-carousel">
          <button
            className="features-nav-btn prev"
            onClick={handlePrevLanguage}
          >
            ‹
          </button>

          <div className="features-content">
            <div className="features-header">
              <span className="features-flag">
                {languages[currentLanguageIndex].flag}
              </span>
              <span className="features-language">
                {languages[currentLanguageIndex].name}
              </span>
            </div>

            <div className="features-main">
              <div className="features-text">
                <h2 className="features-title">
                  miễn phí. vui nhộn. <br />
                  hiểu quả
                </h2>
                <p className="features-description">
                  Học cùng WolfTalk rất vui nhộn,{" "}
                  <strong className="features-highlight">
                    các nghiên cứu đã chứng minh ứng dụng thực sự hiệu quả!
                  </strong>{" "}
                  Các bài học nhỏ gọn sẽ giúp bạn ghi điểm, mở khóa cấp độ mới
                  và luyện tập kỹ năng giao tiếp hữu dụng.
                </p>
              </div>

              <div className="features-illustration">
                <div className="features-device">
                  <div className="device-screen">
                    <div className="device-progress">
                      <div className="progress-bar-filled"></div>
                    </div>
                    <div className="device-avatars">
                      <div className="avatar-item blue">🐱</div>
                      <div className="avatar-item green">🦉</div>
                      <div className="avatar-item orange">🧑</div>
                      <div className="avatar-item brown">👨</div>
                    </div>
                  </div>
                  <div className="device-badge">#1</div>
                </div>
                <div className="features-character">
                  <div className="character-body"></div>
                  <div className="character-ribbon"></div>
                </div>
              </div>
            </div>
          </div>

          <button
            className="features-nav-btn next"
            onClick={handleNextLanguage}
          >
            ›
          </button>
        </div>
      </section>

      {/* ===== SECTIONS PHÍ DƯỚI - MỚI THÊM ===== */}

      {/* ===== BENEFITS SECTION ===== */}
      <section className="benefits-section">
        <div className="benefits-container">
          <h2 className="section-title">Tại sao chọn WolfTalk?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎮</div>
              <h3>Học qua trò chơi</h3>
              <p>
                Các bài học được thiết kế như trò chơi, khiến bạn muốn học mỗi
                ngày
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Tiến độ nhanh chóng</h3>
              <p>Chỉ 5-10 phút mỗi ngày, bạn sẽ thấy sự tiến bộ rõ rệt</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏆</div>
              <h3>Kiếm được phần thưởng</h3>
              <p>Nhận coin để mở khóa nội dung độc quyền và đạt thành tích</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">👥</div>
              <h3>Cộng đồng toàn cầu</h3>
              <p>
                Kết nối với hàng triệu học viên, tham gia thử thách và bảng xếp
                hạng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">100M+</div>
            <div className="stat-label">Học viên hoạt động</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">42+</div>
            <div className="stat-label">Ngôn ngữ có sẵn</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99%</div>
            <div className="stat-label">Hài lòng</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10+</div>
            <div className="stat-label">Năm kinh nghiệm</div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES DETAILED SECTION ===== */}
      <section className="features-detailed-section">
        <div className="features-detailed-container">
          <h2 className="section-title">Cách WolfTalk hoạt động</h2>

          <div className="features-detailed-grid">
            <div className="feature-detailed-card">
              <div className="feature-detailed-number">1</div>
              <h3>Bắt đầu miễn phí</h3>
              <p>Tạo tài khoản chỉ trong 30 giây và bắt đầu học ngay lập tức</p>
            </div>
            <div className="feature-detailed-card">
              <div className="feature-detailed-number">2</div>
              <h3>Chọn ngôn ngữ</h3>
              <p>
                Chọn từ 42+ ngôn ngữ để bắt đầu cuộc phiêu lưu học tập của bạn
              </p>
            </div>
            <div className="feature-detailed-card">
              <div className="feature-detailed-number">3</div>
              <h3>Học mỗi ngày</h3>
              <p>Hoàn thành các bài học nhỏ hàng ngày để xây dựng thói quen</p>
            </div>
            <div className="feature-detailed-card">
              <div className="feature-detailed-number">4</div>
              <h3>Tiến bộ nhanh</h3>
              <p>Theo dõi tiến độ của bạn và đạt những cấp độ mới mỗi tuần</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="section-title">Người học nói gì?</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "WolfTalk đã thay đổi cuộc sống của tôi. Tôi có thể trò chuyện
                tiếng Anh với tự tin bây giờ!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div>
                  <h4>Minh Hạnh</h4>
                  <p className="author-position">Sinh viên, Hà Nội</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Chỉ 3 tháng với WolfTalk, tôi đã vượt qua kỳ thi IELTS. Rất
                hiệu quả!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">T</div>
                <div>
                  <h4>Trung Kiên</h4>
                  <p className="author-position">Kỹ sư, TP.HCM</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Ứng dụng rất dễ sử dụng và các bài học thực sự vui vẻ. Tôi
                không muốn bỏ lỡ ngày nào!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">L</div>
                <div>
                  <h4>Linh Nhi</h4>
                  <p className="author-position">Marketing, Đà Nẵng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section className="pricing-section">
        <div className="pricing-container">
          <h2 className="section-title">Chọn gói phù hợp với bạn</h2>
          <p className="pricing-subtitle">
            Tất cả gói đều bao gồm quyền truy cập vô hạn vào tất cả các bài học
          </p>

          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Miễn Phí</h3>
              <div className="price">$0</div>
              <p className="price-note">Giới hạn 5 bài/ngày</p>
              <ul className="price-features">
                <li>✓ Bài học cơ bản</li>
                <li>✓ Thử thách hàng ngày</li>
                <li>✓ Ứng dụng di động</li>
              </ul>
              <button className="btn-price btn-price-secondary">
                Dùng thử miễn phí
              </button>
            </div>

            <div className="pricing-card featured">
              <div className="popular-badge">PHỔ BIẾN NHẤT</div>
              <h3>Pro</h3>
              <div className="price">$12.99</div>
              <p className="price-note">/tháng</p>
              <ul className="price-features">
                <li>✓ Bài học không giới hạn</li>
                <li>✓ Không có quảng cáo</li>
                <li>✓ Chế độ offline</li>
                <li>✓ Hỗ trợ ưu tiên</li>
              </ul>
              <button className="btn-price btn-price-primary">
                Nâng cấp ngay
              </button>
            </div>

            <div className="pricing-card">
              <h3>Premium</h3>
              <div className="price">$24.99</div>
              <p className="price-note">/tháng</p>
              <ul className="price-features">
                <li>✓ Tất cả trong Pro</li>
                <li>✓ Học 1-1 với giáo viên</li>
                <li>✓ Chứng chỉ quốc tế</li>
                <li>✓ Hỗ trợ VIP 24/7</li>
              </ul>
              <button className="btn-price btn-price-secondary">Bắt đầu</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="faq-section">
        <div className="faq-container">
          <h2 className="section-title">Câu hỏi thường gặp</h2>

          <div className="faq-grid">
            <div className="faq-item">
              <h3>Tôi có thể hủy bỏ đăng ký bất cứ lúc nào không?</h3>
              <p>
                Có, bạn có thể hủy bỏ bất cứ lúc nào. Không có hợp đồng dài hạn,
                không có phí ẩn. Đơn giản như vậy.
              </p>
            </div>
            <div className="faq-item">
              <h3>Tôi cần bao lâu để thành thạo một ngôn ngữ?</h3>
              <p>
                Điều đó phụ thuộc vào nỗ lực của bạn. Trung bình, học viên đạt
                được trình độ trung cấp trong 6-12 tháng học liên tục.
              </p>
            </div>
            <div className="faq-item">
              <h3>WolfTalk có ứng dụng di động không?</h3>
              <p>
                Có! WolfTalk có sẵn trên iOS và Android. Bạn có thể học mọi lúc,
                mọi nơi với ứng dụng di động của chúng tôi.
              </p>
            </div>
            <div className="faq-item">
              <h3>Tôi có thể học với một giáo viên thực hay không?</h3>
              <p>
                Có! Gói Premium của chúng tôi bao gồm các bài học 1-1 với các
                giáo viên asli.
              </p>
            </div>
            <div className="faq-item">
              <h3>Có chứng chỉ nào không?</h3>
              <p>
                Có! Gói Premium bao gồm chứng chỉ quốc tế được công nhận bởi
                hàng ngàn công ty trên thế giới.
              </p>
            </div>
            <div className="faq-item">
              <h3>Học phí có đắt không?</h3>
              <p>
                WolfTalk cung cấp giá cạnh tranh nhất. Bạn có thể bắt đầu miễn
                phí và nâng cấp khi bạn sẵn sàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Sẵn sàng bắt đầu học?</h2>
          <p>
            Tham gia 100 triệu người học trên toàn thế giới và bắt đầu hành
            trình của bạn ngay hôm nay.
          </p>
          <button className="btn-cta" onClick={handleStartClick}>
            Bắt đầu miễn phí
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Về WolfTalk</h4>
            <ul>
              <li>
                <a href="#about">Về chúng tôi</a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
              <li>
                <a href="#careers">Tuyển dụng</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Hỗ trợ</h4>
            <ul>
              <li>
                <a href="#help">Trợ giúp</a>
              </li>
              <li>
                <a href="#faq">Câu hỏi thường gặp</a>
              </li>
              <li>
                <a href="#contact">Liên hệ</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Theo dõi</h4>
            <ul>
              <li>
                <a href="#facebook">Facebook</a>
              </li>
              <li>
                <a href="#instagram">Instagram</a>
              </li>
              <li>
                <a href="#twitter">Twitter</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Pháp lý</h4>
            <ul>
              <li>
                <a href="#privacy">Chính sách riêng tư</a>
              </li>
              <li>
                <a href="#terms">Điều khoản dịch vụ</a>
              </li>
              <li>
                <a href="#cookies">Chính sách Cookie</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 WolfTalk. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
