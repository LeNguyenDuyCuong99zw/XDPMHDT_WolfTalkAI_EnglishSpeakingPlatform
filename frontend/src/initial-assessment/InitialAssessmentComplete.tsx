import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { initialAssessmentAPI } from "../services/initialAssessmentAPI";
import type { InitialAssessmentDTO } from "../services/initialAssessmentAPI";
import { getPackages } from "../services/learningPackageAPI";
import type { LearningPackageDTO } from "../services/learningPackageAPI";
import logoWolf from "../assets/wolftalk/logo_wolf.png";
import "./InitialAssessment.css";

const InitialAssessmentComplete: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [assessment, setAssessment] = useState<InitialAssessmentDTO | null>(
    null,
  );
  const [packages, setPackages] = useState<LearningPackageDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetaking, setIsRetaking] = useState(false);

  useEffect(() => {
    loadAssessmentResult();
    loadPackages();
  }, []);

  const loadAssessmentResult = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await initialAssessmentAPI.getCurrentTest();
      if (!result) {
        throw new Error(
          "Không tìm thấy kết quả đánh giá. Vui lòng làm test từ đầu.",
        );
      }
      setAssessment(result);
    } catch (err) {
      console.error("Failed to load assessment result:", err);
      const errorMessage =
        (err as Error).message ||
        "Không thể tải kết quả. Vui lòng thử lại sau.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPackages = async () => {
    try {
      setPackagesLoading(true);
      const pkgs = await getPackages();
      setPackages(pkgs);
    } catch (err) {
      console.error("Failed to load packages:", err);
    } finally {
      setPackagesLoading(false);
    }
  };

  const handleRetakeTest = async () => {
    try {
      setIsRetaking(true);
      // Bắt đầu test mới
      const newAssessment = await initialAssessmentAPI.startTest();
      // Chuyển hướng tới trang câu hỏi của test mới
      navigate(`/initial-assessment/${newAssessment.id}/questions`);
    } catch (err) {
      console.error("Failed to start new test:", err);
      setError("Không thể bắt đầu test mới");
      setIsRetaking(false);
    }
  };

  const handleSelectPackage = (pkg: LearningPackageDTO) => {
    // Navigate to package selection or learning page with package info
    navigate("/dashboard", { state: { selectedPackage: pkg } });
  };

  const getRecommendedPackage = (): LearningPackageDTO | null => {
    if (!assessment || packages.length === 0) return null;

    const score = assessment.totalScore;
    let recommendedCode = "BASIC";

    // Phân loại gói dựa vào điểm số
    if (score >= 70) {
      recommendedCode = "PROFESSIONAL"; // 70-100: Advanced
    } else if (score >= 40) {
      recommendedCode = "PREMIUM"; // 40-70: Intermediate
    } else {
      recommendedCode = "BASIC"; // 0-40: Beginner
    }

    // Tìm gói phù hợp, nếu không có thì return gói đầu tiên
    return (
      packages.find(
        (pkg) => pkg.packageCode.toUpperCase() === recommendedCode,
      ) || packages[0]
    );
  };

  const getPackageRecommendationText = (): string => {
    if (!assessment) return "";

    const score = assessment.totalScore;

    if (score >= 70) {
      return "Dựa vào trình độ Advanced của bạn, chúng tôi gợi ý gói Professional với mentor và tài liệu nâng cao.";
    } else if (score >= 40) {
      return "Dựa vào trình độ Intermediate của bạn, chúng tôi gợi ý gói Premium với hỗ trợ đầy đủ.";
    } else {
      return "Dựa vào trình độ Beginner của bạn, chúng tôi gợi ý gói Basic để xây dựng nền tảng vững chắc.";
    }
  };

  const getLevelColor = (level: string | null | undefined) => {
    if (!level) return "level-beginner";
    const colors: { [key: string]: string } = {
      beginner: "level-beginner",
      elementary: "level-elementary",
      intermediate: "level-intermediate",
      upper_intermediate: "level-upper-intermediate",
      advanced: "level-advanced",
    };
    return colors[level.toLowerCase()] || "level-beginner";
  };

  const getLevelText = (level: string | null | undefined) => {
    if (!level) return "Chưa xác định";
    const levels: { [key: string]: string } = {
      beginner: "Sơ cấp (Beginner)",
      elementary: "Cơ bản (Elementary)",
      intermediate: "Trung cấp (Intermediate)",
      upper_intermediate: "Trung cấp cao (Upper Intermediate)",
      advanced: "Nâng cao (Advanced)",
    };
    return levels[level.toLowerCase()] || level;
  };

  return (
    <div className="initial-assessment-results-container">
      {/* Main Content Area - Similar to Dashboard */}
      <div className="results-content-wrapper">
        {/* Welcome Header */}
        <div className="results-welcome-header">
          <div className="results-greeting">
            <h1>Kết Quả Đánh Giá Của Bạn 📊</h1>
            <p className="results-subtitle">
              Xem chi tiết kết quả và khuyến nghị học tập
            </p>
          </div>
        </div>

        {/* Results Card */}
        <div className="results-main-card">
          {isLoading ? (
            <div className="loading-level">
              <div className="wolf-mascot-large">
                <img
                  src={logoWolf}
                  alt="WolfTalk Logo"
                  className="wolf-logo-image"
                />
              </div>
              <p>Đang tính toán kết quả của bạn...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <h2>Lỗi Tải Kết Quả</h2>
              <p>{error}</p>
              <button className="btn-retry" onClick={loadAssessmentResult}>
                🔄 Tải Lại
              </button>
            </div>
          ) : assessment ? (
            <div className="result-content">
              {/* Completion Icon */}
              <div className="completion-icon">🎉</div>
              <h1 className="completion-title">Chúc Mừng!</h1>
              <p className="completion-subtitle">
                Bạn đã hoàn thành bài đánh giá trình độ ban đầu.
              </p>

              {/* Level Badge */}
              <div
                className={`level-badge-large ${getLevelColor(assessment.assessmentLevel)}`}
              >
                <div className="level-title">Trình Độ Của Bạn</div>
                <div className="level-name">
                  {getLevelText(assessment.assessmentLevel)}
                </div>
              </div>

              {/* Score Display */}
              <div className="score-display-large">
                <div className="score-circle-large">
                  <div className="score-number-large">
                    {assessment.totalScore}
                  </div>
                  <div className="score-total-large">/100</div>
                </div>
              </div>

              {/* Statistics Row */}
              <div className="result-stats-row">
                <div className="stat-item-large">
                  <span className="stat-label">Tổng Câu Hỏi</span>
                  <span className="stat-value-large">
                    {assessment.totalQuestions}
                  </span>
                </div>
                <div className="stat-item-large">
                  <span className="stat-label">Trả Lời Đúng</span>
                  <span className="stat-value-large">
                    {assessment.correctAnswers}
                  </span>
                </div>
                <div className="stat-item-large">
                  <span className="stat-label">Độ Chính Xác</span>
                  <span className="stat-value-large">
                    {Math.round(
                      (assessment.correctAnswers / assessment.totalQuestions) *
                        100,
                    )}
                    %
                  </span>
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="skills-breakdown-large">
                <h2 className="breakdown-title-large">📊 Điểm Theo Kỹ Năng</h2>
                <div className="skills-grid-large">
                  <div className="skill-item-large">
                    <div className="skill-icon">👂</div>
                    <div className="skill-name">Nghe (Listening)</div>
                    <div className="skill-score-large">
                      {assessment.listeningScore || 0} điểm
                    </div>
                  </div>
                  <div className="skill-item-large">
                    <div className="skill-icon">🗣️</div>
                    <div className="skill-name">Nói (Speaking)</div>
                    <div className="skill-score-large">
                      {assessment.speakingScore || 0} điểm
                    </div>
                  </div>
                  <div className="skill-item-large">
                    <div className="skill-icon">✍️</div>
                    <div className="skill-name">Viết (Writing)</div>
                    <div className="skill-score-large">
                      {assessment.writingScore || 0} điểm
                    </div>
                  </div>
                  <div className="skill-item-large">
                    <div className="skill-icon">📖</div>
                    <div className="skill-name">Đọc (Reading)</div>
                    <div className="skill-score-large">
                      {assessment.readingScore || 0} điểm
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="analysis-section-large">
                {assessment.strengths && (
                  <div className="analysis-box-large strengths-box">
                    <h3 className="analysis-title-large">💪 Điểm Mạnh</h3>
                    <p className="analysis-content-large">
                      {assessment.strengths}
                    </p>
                  </div>
                )}
                {assessment.weaknesses && (
                  <div className="analysis-box-large weaknesses-box">
                    <h3 className="analysis-title-large">🎯 Cần Cải Thiện</h3>
                    <p className="analysis-content-large">
                      {assessment.weaknesses}
                    </p>
                  </div>
                )}
              </div>

              {/* Recommendation */}
              {assessment.recommendation && (
                <div className="recommendation-box-large">
                  <h2 className="recommendation-title-large">📚 Khuyến Nghị</h2>
                  <p className="recommendation-text-large">
                    {assessment.recommendation}
                  </p>
                </div>
              )}

              {/* Packages Recommendation Section */}
              <div className="packages-recommendation-section">
                <h2 className="packages-title">🎁 Gói Học Được Gợi Ý</h2>
                <p className="packages-subtitle">
                  {getPackageRecommendationText()}
                </p>

                {packagesLoading ? (
                  <div className="packages-loading">
                    <p>Đang tải các gói học...</p>
                  </div>
                ) : getRecommendedPackage() ? (
                  <div className="recommended-package-wrapper">
                    {(() => {
                      const recommendedPkg = getRecommendedPackage();
                      if (!recommendedPkg) return null;

                      return (
                        <div
                          key={recommendedPkg.id}
                          className="package-card package-card-featured"
                        >
                          <div className="recommended-badge">
                            ⭐ GỢI Ý CHO BẠN
                          </div>

                          <div className="package-header">
                            <h3 className="package-name">
                              {recommendedPkg.packageName}
                            </h3>
                            <span className="package-code">
                              {recommendedPkg.packageCode}
                            </span>
                          </div>

                          <p className="package-description">
                            {recommendedPkg.description}
                          </p>

                          <div className="package-features">
                            {recommendedPkg.hasMentor && (
                              <div className="feature">
                                <span className="feature-check">✓</span>
                                <span>
                                  Hỗ trợ Mentor (
                                  {recommendedPkg.mentorHoursPerMonth || 0}{" "}
                                  giờ/tháng)
                                </span>
                              </div>
                            )}
                            <div className="feature">
                              <span className="feature-check">✓</span>
                              <span>Truy cập toàn bộ khóa học</span>
                            </div>
                            <div className="feature">
                              <span className="feature-check">✓</span>
                              <span>Tài liệu học tập đầy đủ</span>
                            </div>
                          </div>

                          <div className="package-price">
                            <div className="price-item">
                              <span className="price-label">Giá:</span>
                              <span className="price-value">
                                {recommendedPkg.price?.toLocaleString("vi-VN")}{" "}
                                đ
                              </span>
                            </div>
                            {recommendedPkg.monthlyPrice && (
                              <div className="price-item secondary">
                                <span className="price-label">Tháng:</span>
                                <span className="price-value">
                                  {recommendedPkg.monthlyPrice?.toLocaleString(
                                    "vi-VN",
                                  )}{" "}
                                  đ
                                </span>
                              </div>
                            )}
                          </div>

                          <button
                            className="btn-select-package btn-select-package-featured"
                            onClick={() => handleSelectPackage(recommendedPkg)}
                          >
                            ✨ Chọn Gói Này
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="no-packages">Không có gói học nào</p>
                )}
              </div>
            </div>
          ) : (
            <p>Không thể tải kết quả.</p>
          )}

          <div className="completion-buttons">
            <button
              className="btn-secondary"
              onClick={handleRetakeTest}
              disabled={isLoading || isRetaking}
            >
              {isRetaking ? "Đang bắt đầu..." : "📝 Làm Test Mới"}
            </button>
            <button
              className="btn-start-test"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading || isRetaking}
            >
              🚀 Bắt Đầu Học
            </button>
          </div>

          {/* Thông tin bổ sung */}
          {assessment && (
            <div className="result-info-footer">
              <p className="info-text">
                ℹ️ Bạn có thể xem lại kết quả này bất cứ lúc nào từ Dashboard
                hoặc làm lại bài test để cải thiện điểm số.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialAssessmentComplete;
