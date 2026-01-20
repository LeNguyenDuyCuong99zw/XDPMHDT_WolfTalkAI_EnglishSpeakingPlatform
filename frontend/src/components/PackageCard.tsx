import React from "react";
import "./PackageCard.css";

interface PackageCardProps {
  id: number;
  packageName: string;
  packageCode: string;
  monthlyPrice: number;
  annualPrice: number;
  hasMentor: boolean;
  mentorHoursPerMonth: number;
  description: string;
  features: string[];
  isMostPopular?: boolean;
  badge?: string;
  onSelectPackage: (
    id: number,
    packageCode: string,
    billingCycle: string,
  ) => void;
  currentSubscriptionPackageCode?: string;
}

const PackageCard: React.FC<PackageCardProps> = ({
  id,
  packageName,
  packageCode,
  monthlyPrice,
  annualPrice,
  hasMentor,
  mentorHoursPerMonth,
  description,
  features,
  isMostPopular,
  badge,
  onSelectPackage,
  currentSubscriptionPackageCode,
}) => {
  const isCurrentSubscription = currentSubscriptionPackageCode === packageCode;
  const annualSavings =
    monthlyPrice && annualPrice
      ? Math.round(monthlyPrice * 12 - annualPrice)
      : 0;

  return (
    <div
      className={`package-card ${isMostPopular ? "most-popular" : ""} ${isCurrentSubscription ? "current-subscription" : ""}`}
    >
      {badge && <div className="package-badge">{badge}</div>}
      {isCurrentSubscription && (
        <div className="current-badge">Gói hiện tại</div>
      )}

      <div className="package-header">
        <h3 className="package-name">{packageName}</h3>
        <p className="package-description">{description}</p>
      </div>

      <div className="package-pricing">
        <div className="price-option">
          <div className="price-label">Theo tháng</div>
          <div className="price">
            <span className="currency">₫</span>
            <span className="amount">
              {monthlyPrice?.toLocaleString("vi-VN")}
            </span>
            <span className="period">/tháng</span>
          </div>
        </div>

        {annualPrice && (
          <div className="price-option">
            <div className="price-label">Theo năm</div>
            <div className="price">
              <span className="currency">₫</span>
              <span className="amount">
                {annualPrice?.toLocaleString("vi-VN")}
              </span>
              <span className="period">/năm</span>
            </div>
            {annualSavings > 0 && (
              <div className="savings">
                Tiết kiệm ₫{annualSavings.toLocaleString("vi-VN")}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="package-mentor">
        {hasMentor ? (
          <div className="mentor-info">
            <span className="mentor-icon">👨‍🏫</span>
            <span className="mentor-text">
              Hỗ trợ mentor {mentorHoursPerMonth} giờ/tháng
            </span>
          </div>
        ) : (
          <div className="no-mentor-info">
            <span className="mentor-icon">❌</span>
            <span className="mentor-text">Không có hỗ trợ mentor</span>
          </div>
        )}
      </div>

      <div className="package-features">
        <h4>Tính năng bao gồm:</h4>
        <ul>
          {features &&
            features.slice(0, 5).map((feature, index) => (
              <li key={index}>
                <span className="feature-icon">✓</span>
                {feature}
              </li>
            ))}
          {features && features.length > 5 && (
            <li className="more-features">
              +{features.length - 5} tính năng khác
            </li>
          )}
        </ul>
      </div>

      <div className="package-actions">
        {isCurrentSubscription ? (
          <button className="btn btn-current" disabled>
            Gói hiện tại của bạn
          </button>
        ) : (
          <>
            <button
              className="btn btn-primary"
              onClick={() => onSelectPackage(id, packageCode, "MONTHLY")}
            >
              Đăng ký hàng tháng
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onSelectPackage(id, packageCode, "ANNUAL")}
            >
              Đăng ký hàng năm
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PackageCard;
