// Frontend learning package API service
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Types matching backend DTOs
export interface LearningPackageDTO {
  id: number;
  packageCode: string;          // "BASIC", "PROFESSIONAL", "PREMIUM"
  packageName: string;           // "Gói Cơ Bản", "Gói Professional", etc.
  description: string;
  price: number;                 // Base price (BigDecimal from backend)
  monthlyPrice: number;          // Monthly pricing
  annualPrice: number;           // Annual pricing
  hasMentor: boolean;            // true for Professional/Premium
  mentorHoursPerMonth: number;   // Hours of mentor support per month
  active: boolean;               // Package is active/available
  features?: string[];           // List of package features
}

// Package endpoints
export const getPackages = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/packages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
};

export const getPackageById = async (id: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/packages/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching package:", error);
    throw error;
  }
};

export const getPackagesWithMentor = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/packages/mentor/with`);
    return response.data;
  } catch (error) {
    console.error("Error fetching packages with mentor:", error);
    throw error;
  }
};

export const getPackagesWithoutMentor = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/packages/mentor/without`);
    return response.data;
  } catch (error) {
    console.error("Error fetching packages without mentor:", error);
    throw error;
  }
};

export const getPackageComparison = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/packages/comparison/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching package comparison:", error);
    throw error;
  }
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Subscription endpoints
export const getUserSubscriptions = async (userId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/subscriptions/user/${userId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user subscriptions:", error);
    throw error;
  }
};

export const getActiveSubscription = async (userId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/subscriptions/user/${userId}/active`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching active subscription:", error);
    return null;
  }
};

export const createSubscription = async (
  userId: number,
  packageId: number,
  billingCycle: "MONTHLY" | "ANNUAL" | "ONE_TIME",
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subscriptions`, {
      userId,
      packageId,
      billingCycle,
    }, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/subscriptions/${subscriptionId}`, {
      headers: getAuthHeaders()
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
};

export const isSubscriptionValid = async (subscriptionId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/subscriptions/${subscriptionId}/valid`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking subscription validity:", error);
    return false;
  }
};
