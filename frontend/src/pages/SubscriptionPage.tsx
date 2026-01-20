import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getUserSubscriptions,
  cancelSubscription,
} from "../services/learningPackageAPI";
import "./SubscriptionPage.css";

interface Subscription {
  id: number;
  packageName: string;
  packageCode: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  billingCycle: "MONTHLY" | "ANNUAL" | "ONE_TIME";
  paidAmount: number;
  startDate: string;
  endDate: string;
  nextBillingDate: string | null;
  mentorHoursUsed: number;
  mentorHoursTotal: number;
  active: boolean;
}

const SubscriptionPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"active" | "history">(
    "active",
  );

  useEffect(() => {
    fetchSubscriptions();
  }, [userId]);

  const fetchSubscriptions = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await getUserSubscriptions(Number(userId));
      setSubscriptions(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách subscription. Vui lòng thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: number) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn hủy subscription này không? Bạn sẽ mất quyền truy cập các tính năng cao cấp.",
    );

    if (!confirmed) return;

    try {
      await cancelSubscription(subscriptionId);
      alert("Subscription đã được hủy thành công.");
      fetchSubscriptions();
    } catch (err) {
      alert("Lỗi khi hủy subscription. Vui lòng thử lại.");
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="badge badge-active">Đang hoạt động</span>;
      case "EXPIRED":
        return <span className="badge badge-expired">Hết hạn</span>;
      case "CANCELLED":
        return <span className="badge badge-cancelled">Đã hủy</span>;
      case "PENDING":
        return <span className="badge badge-pending">Đang chờ</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "ACTIVE",
  );
  const historySubscriptions = subscriptions.filter(
    (sub) => sub.status !== "ACTIVE",
  );

  return (
    <div className="subscription-page">
      <div className="page-header">
        <h1>Quản lý Subscription</h1>
        <p className="subtitle">Xem và quản lý các gói subscription của bạn</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="tab-controls">
        <button
          className={`tab-btn ${selectedTab === "active" ? "active" : ""}`}
          onClick={() => setSelectedTab("active")}
        >
          Subscription Đang Hoạt Động ({activeSubscriptions.length})
        </button>
        <button
          className={`tab-btn ${selectedTab === "history" ? "active" : ""}`}
          onClick={() => setSelectedTab("history")}
        >
          Lịch Sử ({historySubscriptions.length})
        </button>
      </div>

      <div className="content-section">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Đang tải subscription...</p>
          </div>
        ) : selectedTab === "active" ? (
          <>
            {activeSubscriptions.length > 0 ? (
              <div className="subscriptions-grid">
                {activeSubscriptions.map((sub) => (
                  <div key={sub.id} className="subscription-card active">
                    <div className="subscription-header">
                      <div className="package-info">
                        <h3 className="package-name">{sub.packageName}</h3>
                        {getStatusBadge(sub.status)}
                      </div>
                    </div>

                    <div className="subscription-details">
                      <div className="detail-item">
                        <span className="label">Gói:</span>
                        <span className="value">{sub.packageCode}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Chu kỳ thanh toán:</span>
                        <span className="value">
                          {sub.billingCycle === "MONTHLY"
                            ? "Hàng tháng"
                            : sub.billingCycle === "ANNUAL"
                              ? "Hàng năm"
                              : "Một lần"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Số tiền đã thanh toán:</span>
                        <span className="value price">
                          ₫{sub.paidAmount?.toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Ngày bắt đầu:</span>
                        <span className="value">
                          {formatDate(sub.startDate)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Ngày kết thúc:</span>
                        <span className="value highlight">
                          {formatDate(sub.endDate)}
                        </span>
                      </div>

                      {sub.nextBillingDate && (
                        <div className="detail-item">
                          <span className="label">Thanh toán tiếp theo:</span>
                          <span className="value">
                            {formatDate(sub.nextBillingDate)}
                          </span>
                        </div>
                      )}

                      {sub.mentorHoursTotal > 0 && (
                        <div className="detail-item">
                          <span className="label">Giờ mentor:</span>
                          <div className="mentor-progress">
                            <span className="value">
                              {sub.mentorHoursUsed} / {sub.mentorHoursTotal} giờ
                            </span>
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${
                                    (sub.mentorHoursUsed /
                                      sub.mentorHoursTotal) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="subscription-actions">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleCancelSubscription(sub.id)}
                      >
                        Hủy Subscription
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Bạn hiện không có subscription nào đang hoạt động.</p>
              </div>
            )}
          </>
        ) : (
          <>
            {historySubscriptions.length > 0 ? (
              <div className="subscriptions-grid">
                {historySubscriptions.map((sub) => (
                  <div key={sub.id} className="subscription-card inactive">
                    <div className="subscription-header">
                      <div className="package-info">
                        <h3 className="package-name">{sub.packageName}</h3>
                        {getStatusBadge(sub.status)}
                      </div>
                    </div>

                    <div className="subscription-details">
                      <div className="detail-item">
                        <span className="label">Gói:</span>
                        <span className="value">{sub.packageCode}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Chu kỳ thanh toán:</span>
                        <span className="value">
                          {sub.billingCycle === "MONTHLY"
                            ? "Hàng tháng"
                            : sub.billingCycle === "ANNUAL"
                              ? "Hàng năm"
                              : "Một lần"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Số tiền đã thanh toán:</span>
                        <span className="value price">
                          ₫{sub.paidAmount?.toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Ngày bắt đầu:</span>
                        <span className="value">
                          {formatDate(sub.startDate)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Ngày kết thúc:</span>
                        <span className="value">{formatDate(sub.endDate)}</span>
                      </div>

                      {sub.mentorHoursTotal > 0 && (
                        <div className="detail-item">
                          <span className="label">Giờ mentor đã sử dụng:</span>
                          <span className="value">
                            {sub.mentorHoursUsed} / {sub.mentorHoursTotal} giờ
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Bạn không có lịch sử subscription nào.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
