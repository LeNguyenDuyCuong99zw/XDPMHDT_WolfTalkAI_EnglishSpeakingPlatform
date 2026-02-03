import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentSuccessPage.css';

interface PaymentSuccessPageProps {}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscription, packageInfo } = location.state || {};

  useEffect(() => {
    // Redirect if no data
    if (!subscription || !packageInfo) {
      navigate('/packages');
    }
  }, [subscription, packageInfo, navigate]);

  if (!subscription || !packageInfo) {
    return null;
  }

  const handleContinue = () => {
    // Redirect to learning platform login
    navigate('/learning/login', {
      state: {
        message: 'Vui lòng đăng nhập để bắt đầu học tập'
      }
    });
  };

  return (
    <div className="payment-success-page">
      <div className="success-container">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark">✓</div>
          </div>
        </div>

        {/* Success Message */}
        <div className="success-content">
          <h1>🎉 Thanh Toán Thành Công!</h1>
          <p className="success-subtitle">
            Chúc mừng bạn đã đăng ký gói học thành công
          </p>

          {/* Package Info */}
          <div className="success-package-info">
            <div className="info-item">
              <span className="info-label">Gói học:</span>
              <span className="info-value">{packageInfo.packageName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mã đơn hàng:</span>
              <span className="info-value">#{subscription.id || 'DEMO-001'}</span>
            </div>
            {packageInfo.hasMentor && (
              <div className="info-item highlight">
                <span className="info-label">✨ Mentor:</span>
                <span className="info-value">
                  {packageInfo.mentorHoursPerMonth} giờ/tháng
                </span>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h2>📝 Bước Tiếp Theo</h2>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Đăng nhập vào nền tảng học tập</h3>
                  <p>Sử dụng tài khoản đã đăng ký để truy cập</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Hoàn thành bài test đánh giá</h3>
                  <p>Xác định trình độ của bạn (60 phút)</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Bắt đầu học tập</h3>
                  <p>Truy cập dashboard và bắt đầu hành trình học</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="btn-continue" onClick={handleContinue}>
            Đăng Nhập Vào Nền Tảng Học Tập →
          </button>

          {/* Additional Info */}
          <div className="additional-info">
            <p>
              📧 Email xác nhận đã được gửi đến hộp thư của bạn
            </p>
            <p>
              💡 Bạn có thể đăng nhập bất cứ lúc nào tại{' '}
              <a href="/learning/login">/learning/login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
