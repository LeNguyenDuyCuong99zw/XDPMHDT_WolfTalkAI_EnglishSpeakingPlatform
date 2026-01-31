// src/presentation/pages/admin/TransactionsPage/TransactionsPage.tsx
import React, { useState } from "react";
import {
  DollarSign,
  CreditCard,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Eye,
  Receipt,
  TrendingUp,
  Wallet,
  Building2,
  Smartphone,
} from "lucide-react";
import "./TransactionsPage.css";

// Enhanced mock data
const mockTransactions = [
  {
    id: "TXN-2025-001",
    userId: "user-123",
    userName: "Nguyễn Văn An",
    userEmail: "nguyenvanan@gmail.com",
    userAvatar: null,
    planName: "Premium Plan",
    amount: 299000,
    currency: "VND",
    status: "approved",
    paymentMethod: "Credit Card",
    paymentProvider: "Visa",
    transactionCode: "VISA-4532",
    createdAt: "2025-12-23T08:30:00Z",
  },
  {
    id: "TXN-2025-002",
    userId: "user-456",
    userName: "Trần Thị Bình",
    userEmail: "tranthib@gmail.com",
    userAvatar: null,
    planName: "Basic Plan",
    amount: 99000,
    currency: "VND",
    status: "pending",
    paymentMethod: "Bank Transfer",
    paymentProvider: "Vietcombank",
    transactionCode: "VCB-1234",
    createdAt: "2025-12-23T10:15:00Z",
  },
  {
    id: "TXN-2025-003",
    userId: "user-789",
    userName: "Lê Minh Cường",
    userEmail: "leminhcuong@gmail.com",
    userAvatar: null,
    planName: "Pro Plan",
    amount: 499000,
    currency: "VND",
    status: "rejected",
    paymentMethod: "E-Wallet",
    paymentProvider: "MoMo",
    transactionCode: "MOMO-5678",
    createdAt: "2025-12-22T15:45:00Z",
  },
  {
    id: "TXN-2025-004",
    userId: "user-321",
    userName: "Phạm Thu Hằng",
    userEmail: "phamthuhang@gmail.com",
    userAvatar: null,
    planName: "Premium Plan",
    amount: 299000,
    currency: "VND",
    status: "approved",
    paymentMethod: "Credit Card",
    paymentProvider: "Mastercard",
    transactionCode: "MC-9012",
    createdAt: "2025-12-22T11:20:00Z",
  },
  {
    id: "TXN-2025-005",
    userId: "user-654",
    userName: "Hoàng Đức Thịnh",
    userEmail: "hoangducthinh@gmail.com",
    userAvatar: null,
    planName: "Basic Plan",
    amount: 99000,
    currency: "VND",
    status: "approved",
    paymentMethod: "E-Wallet",
    paymentProvider: "ZaloPay",
    transactionCode: "ZALO-3456",
    createdAt: "2025-12-21T14:30:00Z",
  },
  {
    id: "TXN-2025-006",
    userId: "user-987",
    userName: "Võ Thị Mai",
    userEmail: "vothimai@gmail.com",
    userAvatar: null,
    planName: "Pro Plan",
    amount: 499000,
    currency: "VND",
    status: "pending",
    paymentMethod: "Bank Transfer",
    paymentProvider: "Techcombank",
    transactionCode: "TCB-7890",
    createdAt: "2025-12-21T09:10:00Z",
  },
];

export const TransactionsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [transactions] = useState(mockTransactions);

  const filteredTransactions =
    statusFilter === "all"
      ? transactions
      : transactions.filter((t) => t.status === statusFilter);

  // Calculate stats
  const stats = {
    total: transactions.length,
    totalRevenue: transactions
      .filter((t) => t.status === "approved")
      .reduce((sum, t) => sum + t.amount, 0),
    pending: transactions.filter((t) => t.status === "pending").length,
    approved: transactions.filter((t) => t.status === "approved").length,
    rejected: transactions.filter((t) => t.status === "rejected").length,
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "rejected":
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "Credit Card":
        return <CreditCard size={14} />;
      case "Bank Transfer":
        return <Building2 size={14} />;
      case "E-Wallet":
        return <Smartphone size={14} />;
      default:
        return <Wallet size={14} />;
    }
  };

  return (
    <div className="transactions-page">
      {/* Header */}
      <header className="transactions-page__header glass-card">
        <div className="transactions-page__header-main">
          <div className="transactions-page__header-icon">
            <Receipt size={24} />
          </div>
          <div>
            <h1 className="transactions-page__title">Transactions</h1>
            <p className="transactions-page__subtitle">
              Monitor all payment transactions and subscriptions
            </p>
          </div>
        </div>
        <button className="transactions-page__export-btn" type="button">
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </header>

      {/* Stats Grid */}
      <div className="transactions-page__stats">
        <div className="transactions-page__stat-card transactions-page__stat-card--revenue glass-card">
          <div className="transactions-page__stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="transactions-page__stat-content">
            <div className="transactions-page__stat-label">Total Revenue</div>
            <div className="transactions-page__stat-value">
              {formatCurrency(stats.totalRevenue, "VND")}
            </div>
          </div>
        </div>

        <div className="transactions-page__stat-card transactions-page__stat-card--pending glass-card">
          <div className="transactions-page__stat-icon">
            <Clock size={24} />
          </div>
          <div className="transactions-page__stat-content">
            <div className="transactions-page__stat-label">Pending</div>
            <div className="transactions-page__stat-value">{stats.pending}</div>
          </div>
        </div>

        <div className="transactions-page__stat-card transactions-page__stat-card--approved glass-card">
          <div className="transactions-page__stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="transactions-page__stat-content">
            <div className="transactions-page__stat-label">Approved</div>
            <div className="transactions-page__stat-value">
              {stats.approved}
            </div>
          </div>
        </div>

        <div className="transactions-page__stat-card transactions-page__stat-card--rejected glass-card">
          <div className="transactions-page__stat-icon">
            <XCircle size={24} />
          </div>
          <div className="transactions-page__stat-content">
            <div className="transactions-page__stat-label">Rejected</div>
            <div className="transactions-page__stat-value">
              {stats.rejected}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="transactions-page__filter glass-card">
        <div className="transactions-page__filter-group">
          <Filter className="transactions-page__filter-icon" size={18} />
          <span className="transactions-page__filter-label">
            Filter by status:
          </span>
          <select
            className="transactions-page__filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Transactions ({stats.total})</option>
            <option value="approved">Approved ({stats.approved})</option>
            <option value="pending">Pending ({stats.pending})</option>
            <option value="rejected">Rejected ({stats.rejected})</option>
          </select>
        </div>
        <div className="transactions-page__filter-result">
          Showing <strong>{filteredTransactions.length}</strong> transactions
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length > 0 ? (
        <div className="transactions-page__table-card glass-card">
          <div className="transactions-page__table-wrapper">
            <table className="transactions-page__table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Customer</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Transaction ID */}
                    <td>
                      <div className="transactions-page__transaction-id">
                        <Receipt size={16} />
                        <div className="transactions-page__transaction-id-content">
                          <span className="transactions-page__transaction-id-main">
                            {transaction.id}
                          </span>
                          <span className="transactions-page__transaction-id-code">
                            {transaction.transactionCode}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="transactions-page__customer-cell">
                        <div className="transactions-page__customer-avatar">
                          <User size={16} />
                        </div>
                        <div className="transactions-page__customer-info">
                          <div className="transactions-page__customer-name">
                            {transaction.userName}
                          </div>
                          <div className="transactions-page__customer-email">
                            {transaction.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td>
                      <div className="transactions-page__plan-badge">
                        <CreditCard size={14} />
                        <span>{transaction.planName}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td>
                      <div className="transactions-page__amount-cell">
                        <DollarSign size={18} />
                        <span className="transactions-page__amount-value">
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency,
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td>
                      <div className="transactions-page__payment-method">
                        {getPaymentIcon(transaction.paymentMethod)}
                        <div className="transactions-page__payment-info">
                          <span className="transactions-page__payment-type">
                            {transaction.paymentMethod}
                          </span>
                          <span className="transactions-page__payment-provider">
                            {transaction.paymentProvider}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={`transactions-page__status-badge transactions-page__status-badge--${transaction.status}`}
                      >
                        {getStatusIcon(transaction.status)}
                        {transaction.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td>
                      <div className="transactions-page__date-cell">
                        <Calendar size={14} />
                        {formatDate(transaction.createdAt)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <button
                        className="transactions-page__action-btn"
                        type="button"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="transactions-page__empty glass-card">
          <div className="transactions-page__empty-icon">
            <Receipt size={64} />
          </div>
          <h3 className="transactions-page__empty-title">
            No transactions found
          </h3>
          <p className="transactions-page__empty-text">
            {statusFilter === "all"
              ? "There are no transactions to display"
              : `No ${statusFilter} transactions found. Try changing your filter.`}
          </p>
        </div>
      )}
    </div>
  );
};
