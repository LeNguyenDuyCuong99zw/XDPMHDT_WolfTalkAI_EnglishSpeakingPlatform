// src/presentation/pages/admin/DashboardPage/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  DollarSign,
  MessageCircle,
  TrendingUp,
  Activity,
  CheckCircle,
  UserPlus,
  ShoppingCart,
  Award,
  ArrowUpRight,
  Sparkles,
  Star,
  Target,
  BarChart3,
  Mic,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { userAdminAPI } from "../../../../services/admin/userAdminAPI";
import "./DashboardPage.css";

interface StatData {
  label: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
  color: "blue" | "purple" | "green" | "orange";
  prefix?: string;
}

interface ActivityData {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "orange" | "green" | "yellow";
}

interface MentorData {
  name: string;
  sessions: number;
  rating: number;
  revenue: string;
  specialty: string;
}

const statsData: StatData[] = [
  {
    label: "Total Learners",
    value: 0, // Will be updated from API
    icon: <Users size={24} />,
    trend: 18.2,
    color: "blue",
  },
  {
    label: "Active Mentors",
    value: 89,
    icon: <GraduationCap size={24} />,
    trend: 12.5,
    color: "purple",
  },
  {
    label: "Total Revenue",
    value: 125400,
    prefix: "₫",
    icon: <DollarSign size={24} />,
    trend: 24.8,
    color: "green",
  },
  {
    label: "Speaking Sessions",
    value: 8945,
    icon: <MessageCircle size={24} />,
    trend: 31.2,
    color: "orange",
  },
];

const revenueData = [
  { month: "Jan", revenue: 85000, sessions: 1200 },
  { month: "Feb", revenue: 92000, sessions: 1450 },
  { month: "Mar", revenue: 98000, sessions: 1580 },
  { month: "Apr", revenue: 110000, sessions: 1820 },
  { month: "May", revenue: 118000, sessions: 1950 },
  { month: "Jun", revenue: 125400, sessions: 2100 },
];

const enrollmentData = [
  { name: "IELTS Speaking", value: 2845 },
  { name: "Business English", value: 1920 },
  { name: "Daily Conversation", value: 2680 },
  { name: "TOEFL Speaking", value: 1500 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#22c55e"];

const performanceData = [
  { category: "Fluency", current: 88, previous: 78 },
  { category: "Pronunciation", current: 85, previous: 75 },
  { category: "Vocabulary", current: 90, previous: 82 },
  { category: "Grammar", current: 82, previous: 74 },
  { category: "Confidence", current: 92, previous: 85 },
];

const activitiesData: ActivityData[] = [
  {
    id: "1",
    title: "New Session Completed",
    description:
      "Nguyễn Văn An completed IELTS Speaking Part 2 with mentor Sarah",
    time: "15 minutes ago",
    icon: <CheckCircle size={18} />,
    color: "green",
  },
  {
    id: "2",
    title: "New Learner Registered",
    description: "Trần Thị Bình joined the platform - Daily Conversation track",
    time: "1 hour ago",
    icon: <UserPlus size={18} />,
    color: "blue",
  },
  {
    id: "3",
    title: "Payment Received",
    description: "Premium plan purchased by Lê Minh Cường - ₫299,000",
    time: "2 hours ago",
    icon: <ShoppingCart size={18} />,
    color: "orange",
  },
  {
    id: "4",
    title: "Milestone Achieved",
    description: "Phạm Thu Hằng completed 50 speaking sessions",
    time: "4 hours ago",
    icon: <Award size={18} />,
    color: "purple",
  },
  {
    id: "5",
    title: "New Review",
    description: "Hoàng Đức Thịnh rated mentor John 5 stars",
    time: "6 hours ago",
    icon: <Sparkles size={18} />,
    color: "yellow",
  },
];

const topMentorsData: MentorData[] = [
  {
    name: "Sarah Williams",
    sessions: 324,
    rating: 4.9,
    revenue: "₫18,500,000",
    specialty: "IELTS Speaking",
  },
  {
    name: "John Anderson",
    sessions: 298,
    rating: 4.8,
    revenue: "₫16,200,000",
    specialty: "Business English",
  },
  {
    name: "Emily Chen",
    sessions: 276,
    rating: 4.9,
    revenue: "₫15,800,000",
    specialty: "Daily Conversation",
  },
  {
    name: "Michael Brown",
    sessions: 245,
    rating: 4.7,
    revenue: "₫13,900,000",
    specialty: "TOEFL Speaking",
  },
];

export const DashboardPage: React.FC = () => {
  const [animatedStats, setAnimatedStats] = useState<number[]>([0, 0, 0, 0]);
  const [stats, setStats] = useState<StatData[]>(statsData);
  const [loading, setLoading] = useState(true);

  // Fetch total learners from API
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        // Fetch all users to count only Learners
        const result = await userAdminAPI.getAllUsers();

        // Filter only Learner users (not ADMIN or MENTOR)
        const learnerUsers = result.filter((user: any) => {
          const roles = user.roles || "";
          return !roles.includes("ADMIN") && !roles.includes("MENTOR");
        });

        const totalLearners = learnerUsers.length;

        // Update statsData with real learner count
        const updatedStats = [...statsData];
        updatedStats[0].value = totalLearners;
        setStats(updatedStats);

        // Reset animation with new data
        setAnimatedStats([0, 0, 0, 0]);
      } catch (error) {
        console.error("Error fetching user count:", error);
        setStats(statsData);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCount();
  }, []);

  // Animation effect
  useEffect(() => {
    const duration = 1600;
    const steps = 50;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setAnimatedStats(stats.map((stat) => Math.round(stat.value * progress)));

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(stats.map((stat) => stat.value));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const formatNumber = (num: number): string => num.toLocaleString("vi-VN");

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard__header glass-card">
        <div className="dashboard__header-main">
          <div className="dashboard__header-icon">
            <Activity size={28} />
          </div>
          <div>
            <h1 className="dashboard__title">Welcome back, Admin! 👋</h1>
            <p className="dashboard__subtitle">
              Monitor your speaking practice platform's performance
            </p>
          </div>
        </div>
        <div className="dashboard__header-badge">
          <span className="dashboard__pulse-dot" />
          <span>Live</span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="dashboard__stats">
        {stats.map((stat, index) => (
          <article
            key={stat.label}
            className={`dashboard__stat-card dashboard__stat-card--${stat.color} glass-card`}
            style={{ animationDelay: `${0.1 + index * 0.08}s` }}
          >
            <header className="dashboard__stat-header">
              <span className="dashboard__stat-label">{stat.label}</span>
              <div className="dashboard__stat-icon-wrapper">
                <div className="dashboard__stat-icon">{stat.icon}</div>
              </div>
            </header>

            <div className="dashboard__stat-body">
              <p className="dashboard__stat-value">
                {stat.prefix}
                {formatNumber(animatedStats[index])}
              </p>
              <div className="dashboard__stat-trend dashboard__stat-trend--positive">
                <ArrowUpRight size={14} />
                <span className="dashboard__stat-trend-value">
                  {stat.trend}%
                </span>
                <span className="dashboard__stat-trend-label">
                  vs last month
                </span>
              </div>
            </div>

            <div className="dashboard__stat-gradient" />
          </article>
        ))}
      </div>

      {/* Charts Grid */}
      <section className="dashboard__charts">
        {/* Revenue & Sessions Trend */}
        <div
          className="dashboard__chart-card dashboard__chart-card--large glass-card"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="dashboard__chart-header">
            <div>
              <h3 className="dashboard__chart-title">
                <TrendingUp size={20} />
                Revenue &amp; Sessions Trend
              </h3>
              <p className="dashboard__chart-subtitle">
                Last 6 months performance
              </p>
            </div>
          </div>
          <div className="dashboard__chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient
                    id="colorSessions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.2)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.98)",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(15,23,42,0.15)",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#colorRevenue)"
                  name="Revenue (₫)"
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#colorSessions)"
                  name="Sessions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sessions by Category */}
        <div
          className="dashboard__chart-card glass-card"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="dashboard__chart-header">
            <div>
              <h3 className="dashboard__chart-title">
                <Target size={20} />
                Sessions by Category
              </h3>
              <p className="dashboard__chart-subtitle">
                Total: {formatNumber(8945)} sessions
              </p>
            </div>
          </div>
          <div className="dashboard__chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={enrollmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  dataKey="value"
                  label={(entry) =>
                    `${entry.name}: ${Math.round((entry.value / 8945) * 100)}%`
                  }
                >
                  {enrollmentData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.98)",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(15,23,42,0.15)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Performance */}
        <div
          className="dashboard__chart-card glass-card"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="dashboard__chart-header">
            <div>
              <h3 className="dashboard__chart-title">
                <BarChart3 size={20} />
                Learning Performance
              </h3>
              <p className="dashboard__chart-subtitle">
                Average scores - Current vs Previous
              </p>
            </div>
          </div>
          <div className="dashboard__chart-body">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={performanceData}
                margin={{ top: 10, right: 16, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(148,163,184,0.2)"
                  vertical={false}
                />
                <XAxis
                  dataKey="category"
                  stroke="#94a3b8"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.98)",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: 12,
                    boxShadow: "0 8px 24px rgba(15,23,42,0.15)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="current"
                  fill="#3b82f6"
                  name="Current Quarter"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="previous"
                  fill="#8b5cf6"
                  name="Previous Quarter"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Bottom Grid */}
      <section className="dashboard__bottom-grid">
        {/* Recent Activity */}
        <div
          className="dashboard__activity glass-card"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="dashboard__activity-header">
            <h3 className="dashboard__activity-title">
              <Activity size={20} />
              Recent Activity
            </h3>
            <div className="dashboard__activity-badge">
              <span className="dashboard__pulse-dot" />
              <span>Live</span>
            </div>
          </div>

          <div className="dashboard__activity-list">
            {activitiesData.map((activity, index) => (
              <div
                key={activity.id}
                className="dashboard__activity-item"
                style={{ animationDelay: `${0.8 + index * 0.05}s` }}
              >
                <div
                  className={`dashboard__activity-icon dashboard__activity-icon--${activity.color}`}
                >
                  {activity.icon}
                </div>
                <div className="dashboard__activity-content">
                  <div className="dashboard__activity-title-text">
                    {activity.title}
                  </div>
                  <div className="dashboard__activity-description">
                    {activity.description}
                  </div>
                </div>
                <div className="dashboard__activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Mentors */}
        <div
          className="dashboard__mentors glass-card"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="dashboard__mentors-header">
            <h3 className="dashboard__mentors-title">
              <Star size={20} />
              Top Performing Mentors
            </h3>
          </div>

          <div className="dashboard__mentors-list">
            {topMentorsData.map((mentor, index) => (
              <div
                key={mentor.name}
                className="dashboard__mentor-item"
                style={{ animationDelay: `${0.9 + index * 0.05}s` }}
              >
                <div className="dashboard__mentor-rank">#{index + 1}</div>
                <div className="dashboard__mentor-info">
                  <div className="dashboard__mentor-name">{mentor.name}</div>
                  <div className="dashboard__mentor-specialty">
                    <Mic size={12} />
                    {mentor.specialty}
                  </div>
                  <div className="dashboard__mentor-meta">
                    <span className="dashboard__mentor-sessions">
                      <MessageCircle size={12} />
                      {formatNumber(mentor.sessions)} sessions
                    </span>
                    <span className="dashboard__mentor-rating">
                      <Star size={12} fill="currentColor" />
                      {mentor.rating}
                    </span>
                  </div>
                </div>
                <div className="dashboard__mentor-revenue">
                  {mentor.revenue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
