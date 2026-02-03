import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createSubscription } from '../services/learningPackageAPI';
import './PaymentPage.css';

interface PaymentPageProps {}

interface PackageInfo {
  id: number;
  packageCode: string;
  packageName: string;
  price: number;
  billingCycle: 'MONTHLY' | 'ANNUAL';
  hasMentor: boolean;
  mentorHoursPerMonth?: number;
}

export const PaymentPage: React.FC<PaymentPageProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Get package info from navigation state
  const packageInfo = location.state as PackageInfo;

  useEffect(() => {
    // Redirect if no package info
    if (!packageInfo) {
      navigate('/packages');
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      // Save package info to sessionStorage for after login
      sessionStorage.setItem('pendingPayment', JSON.stringify(packageInfo));
      
      // Redirect to login with return URL
      navigate('/learning/login', {
        state: {
          message: 'Vui lòng đăng nhập để tiếp tục thanh toán',
          returnTo: '/payment'
        }
      });
    }
  }, [packageInfo, navigate]);

  if (!packageInfo) {
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Get authenticated user from localStorage
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      // Parse user object to get userId
      let userId: number;
      try {
        const user = JSON.parse(userStr);
        userId = parseInt(user.id);
        
        if (!userId || isNaN(userId)) {
          throw new Error('Không tìm thấy thông tin người dùng');
        }
      } catch (parseError) {
        throw new Error('Lỗi đọc thông tin người dùng');
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create subscription with authenticated user's ID
      const subscription = await createSubscription(
        userId,
        packageInfo.id,
        packageInfo.billingCycle as 'MONTHLY' | 'ANNUAL' | 'ONE_TIME'
      );

      // Redirect to success page
      navigate('/payment/success', {
        state: {
          subscription,
          packageInfo
        }
      });
    } catch (err: any) {
      console.error('Payment failed:', err);
      setError(err.message || 'Thanh toán thất bại. Vui lòng thử lại.');
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>🎓 Xác Nhận Thanh Toán</h1>
          <p>Hoàn tất đăng ký gói học của bạn</p>
        </div>

        <div className="payment-content">
          {/* Package Summary */}
          <div className="package-summary">
            <h2>📦 Thông Tin Gói Học</h2>
            <div className="summary-item">
              <span className="label">Gói:</span>
              <span className="value">{packageInfo.packageName}</span>
            </div>
            <div className="summary-item">
              <span className="label">Chu kỳ:</span>
              <span className="value">
                {packageInfo.billingCycle === 'MONTHLY' ? 'Hàng tháng' : 'Hàng năm'}
              </span>
            </div>
            {packageInfo.hasMentor && (
              <div className="summary-item highlight">
                <span className="label">✨ Mentor:</span>
                <span className="value">
                  {packageInfo.mentorHoursPerMonth} giờ/tháng
                </span>
              </div>
            )}
            <div className="summary-divider"></div>
            <div className="summary-item total">
              <span className="label">Tổng cộng:</span>
              <span className="value price">{formatPrice(packageInfo.price)}</span>
            </div>
          </div>

          {/* Payment Method (Mock) */}
          <div className="payment-method">
            <h2>💳 Phương Thức Thanh Toán</h2>
            <div className="method-card selected">
              <div className="method-icon">💰</div>
              <div className="method-info">
                <h3>Thanh Toán Demo</h3>
                <p>Chỉ cần nhấn nút để hoàn tất (Demo mode)</p>
              </div>
              <div className="method-check">✓</div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="payment-actions">
            <button
              className="btn-back"
              onClick={() => navigate('/packages')}
              disabled={isProcessing}
            >
              ← Quay lại
            </button>
            <button
              className="btn-pay"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  ✓ Xác Nhận Thanh Toán
                </>
              )}
            </button>
          </div>

          {/* Info Note */}
          <div className="payment-note">
            <p>
              💡 <strong>Lưu ý:</strong> Đây là chế độ demo. Bạn sẽ không bị tính phí thực tế.
              Sau khi xác nhận, bạn sẽ được chuyển đến trang đăng nhập học tập.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
