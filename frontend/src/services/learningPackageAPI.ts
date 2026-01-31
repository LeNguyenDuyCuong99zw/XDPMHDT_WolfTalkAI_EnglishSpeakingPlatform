// Frontend learning package API service
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Types
export interface LearningPackageDTO {
  id: number;
  name: string;
  description: string;
  level: string;
  price: number;
  currency: string;
  features: string[];
  hasMentor: boolean;
  duration?: number;
  isActive: boolean;
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

// Subscription endpoints
export const getUserSubscriptions = async (userId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/subscriptions/user/${userId}`,
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
    });
    return response.data;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/subscriptions/${subscriptionId}`);
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
};

export const isSubscriptionValid = async (subscriptionId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/subscriptions/${subscriptionId}/valid`,
    );
    return response.data;
  } catch (error) {
    console.error("Error checking subscription validity:", error);
    return false;
  }
};
