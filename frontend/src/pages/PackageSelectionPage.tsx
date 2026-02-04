import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PackageCard from "../components/PackageCard";
import {
  getPackages,
  getActiveSubscription,
  createSubscription,
} from "../services/learningPackageAPI";
import "./PackageSelectionPage.css";

interface Package {
  id: number;
  packageCode: string;
  packageName: string;
  monthlyPrice: number;
  annualPrice: number;
  hasMentor: boolean;
  mentorHoursPerMonth: number;
  description: string;
  features: string[];
  isMostPopular?: boolean;
  badge?: string;
}

interface Subscription {
  packageCode: string;
}

const PackageSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  // Remove userId from URL params - get from authenticated user instead
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [filterMentor, setFilterMentor] = useState<"all" | "with" | "without">(
    "all",
  );
  const [selectedTab, setSelectedTab] = useState<"overview" | "comparison">(
    "overview",
  );
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchPackages();
    // Check for authenticated user to fetch their subscription
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) {
          fetchCurrentSubscription(user.id);
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await getPackages();
      setPackages(data);
      setError(null);
      setErrorDetails(null);
    } catch (err) {
      // User-facing message
      setError("Không thể tải danh sách gói. Vui lòng thử lại sau.");

      // Developer details: only keep for dev environment
      try {
        // axios error shape: err.response, err.message
        const anyErr = err as any;
        let details = null as string | null;
        if (anyErr?.response) {
          try {
            details = JSON.stringify(
              { status: anyErr.response.status, data: anyErr.response.data },
              null,
              2,
            );
          } catch (e) {
            details = String(anyErr.response.data || anyErr.response);
          }
        } else {
          details = anyErr?.stack || anyErr?.message || String(anyErr);
        }

        if (import.meta.env.DEV) {
          setErrorDetails(details);
        } else {
          setErrorDetails(null);
        }
      } catch (e) {
        setErrorDetails(null);
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async (userId: number) => {
    try {
      const subscription = await getActiveSubscription(userId);
      setCurrentSubscription(subscription);
    } catch (err) {
      console.error("Error fetching current subscription:", err);
      // Not critical if this fails
    }
  };

  const handleSelectPackage = (
    packageId: number,
    packageCode: string,
    billingCycle: "MONTHLY" | "ANNUAL",
  ) => {
    // Find package details
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      alert("Không tìm thấy gói học");
      return;
    }

    const price = billingCycle === 'MONTHLY' 
      ? selectedPackage.monthlyPrice 
      : selectedPackage.annualPrice;

    // Check authentication before proceeding
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      // Save FULL pending selection for after login
      sessionStorage.setItem('pendingPackageSelection', JSON.stringify({
        id: packageId,
        packageCode,
        packageName: selectedPackage.packageName,
        price,
        billingCycle,
        hasMentor: selectedPackage.hasMentor,
        mentorHoursPerMonth: selectedPackage.mentorHoursPerMonth
      }));
      navigate("/learning/login", {
        state: { message: "Vui lòng đăng nhập để tiếp tục đăng ký" }
      });
      return;
    }

    // Navigate to payment page with complete package info
    navigate('/payment', {
      state: {
        id: packageId,
        packageCode,
        packageName: selectedPackage.packageName,
        price,
        billingCycle,
        hasMentor: selectedPackage.hasMentor,
        mentorHoursPerMonth: selectedPackage.mentorHoursPerMonth
      }
    });
  };

  const filteredPackages = packages.filter((pkg) => {
    if (filterMentor === "with") return pkg.hasMentor;
    if (filterMentor === "without") return !pkg.hasMentor;
    return true;
  });

  const renderPackageCards = () => (
    <div className="packages-grid">
      {filteredPackages.map((pkg) => (
        <PackageCard
          key={pkg.id}
          id={pkg.id}
          packageName={pkg.packageName}
          packageCode={pkg.packageCode}
          monthlyPrice={pkg.monthlyPrice}
          annualPrice={pkg.annualPrice}
          hasMentor={pkg.hasMentor}
          mentorHoursPerMonth={pkg.mentorHoursPerMonth}
          description={pkg.description}
          features={pkg.features}
          isMostPopular={pkg.isMostPopular}
          badge={pkg.badge}
          onSelectPackage={handleSelectPackage}
          currentSubscriptionPackageCode={currentSubscription?.packageCode}
        />
      ))}
    </div>
  );

  const renderComparison = () => (
    <div className="comparison-container">
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th className="feature-column">Tính năng</th>
              {filteredPackages.map((pkg) => (
                <th key={pkg.id} className="package-column">
                  {pkg.packageName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="feature-label">Giá hàng tháng</td>
              {filteredPackages.map((pkg) => (
                <td key={pkg.id} className="price-cell">
                  ₫{pkg.monthlyPrice?.toLocaleString("vi-VN")}
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-label">Giá hàng năm</td>
              {filteredPackages.map((pkg) => (
                <td key={pkg.id} className="price-cell">
                  ₫{pkg.annualPrice?.toLocaleString("vi-VN")}
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-label">Hỗ trợ Mentor</td>
              {filteredPackages.map((pkg) => (
                <td key={pkg.id} className="check-cell">
                  {pkg.hasMentor ? (
                    <span className="check-mark">
                      ✓ {pkg.mentorHoursPerMonth}h/tháng
                    </span>
                  ) : (
                    <span className="cross-mark">✗</span>
                  )}
                </td>
              ))}
            </tr>
            {filteredPackages[0]?.features?.map((_, featureIndex) => (
              <tr key={featureIndex}>
                <td className="feature-label">
                  {filteredPackages[0].features[featureIndex]}
                </td>
                {filteredPackages.map((pkg) => (
                  <td key={pkg.id} className="check-cell">
                    {pkg.features && pkg.features[featureIndex] ? (
                      <span className="check-mark">✓</span>
                    ) : (
                      <span className="cross-mark">✗</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="package-selection-layout">
      <Sidebar />
      <div className="package-selection-page">
        <div className="page-header">
          <h1>Chọn Gói Học Phù Hợp</h1>
          <p className="subtitle">
            Nâng cấp tài khoản của bạn để mở khóa tất cả các tính năng cao cấp
          </p>
          <p className="login-prompt" style={{ marginTop: '10px', fontSize: '0.95rem', color: '#666' }}>
            Đã có tài khoản hoặc đã mua gói?{' '}
            <a href="/learning/login" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 500 }}>
              Đăng nhập ngay
            </a>
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="controls-section">
          <div className="filter-controls">
            <div className="filter-group">
              <label>Lọc theo Mentor:</label>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filterMentor === "all" ? "active" : ""}`}
                  onClick={() => setFilterMentor("all")}
                >
                  Tất cả
                </button>
                <button
                  className={`filter-btn ${filterMentor === "with" ? "active" : ""}`}
                  onClick={() => setFilterMentor("with")}
                >
                  Có Mentor
                </button>
                <button
                  className={`filter-btn ${filterMentor === "without" ? "active" : ""}`}
                  onClick={() => setFilterMentor("without")}
                >
                  Không Mentor
                </button>
              </div>
            </div>
          </div>

          <div className="tab-controls">
            <button
              className={`tab-btn ${selectedTab === "overview" ? "active" : ""}`}
              onClick={() => setSelectedTab("overview")}
            >
              Xem Tổng Quan
            </button>
            <button
              className={`tab-btn ${selectedTab === "comparison" ? "active" : ""}`}
              onClick={() => setSelectedTab("comparison")}
            >
              So Sánh Chi Tiết
            </button>
          </div>
        </div>

        <div className="content-section">
          {error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h2>Không thể tải danh sách gói</h2>
              <p>{error}</p>
              <div className="error-actions">
                <button
                  className="btn btn-retry"
                  onClick={fetchPackages}
                  disabled={loading}
                >
                  {loading ? "Đang tải..." : "Thử lại"}
                </button>
                {errorDetails && import.meta.env.DEV && (
                  <button
                    className="btn btn-link"
                    onClick={() => setShowErrorDetails((s) => !s)}
                  >
                    {showErrorDetails ? "Ẩn chi tiết" : "Xem chi tiết lỗi"}
                  </button>
                )}
              </div>

              {showErrorDetails && errorDetails && import.meta.env.DEV && (
                <pre className="error-details" aria-live="polite">
                  {errorDetails}
                </pre>
              )}
            </div>
          ) : loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Đang tải danh sách gói...</p>
            </div>
          ) : filteredPackages.length > 0 ? (
            <>
              {selectedTab === "overview" && renderPackageCards()}
              {selectedTab === "comparison" && renderComparison()}
            </>
          ) : (
            <div className="empty-state">
              <p>Không có gói nào phù hợp với bộ lọc của bạn</p>
            </div>
          )}
          {purchasing && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageSelectionPage;
