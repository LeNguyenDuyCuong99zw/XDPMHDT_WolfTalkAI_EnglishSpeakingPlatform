// Type definitions for Learning Packages System

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";

export type BillingCycle = "MONTHLY" | "ANNUAL" | "ONE_TIME";

// Learning Package Types
export interface LearningPackage {
  id: number;
  packageCode: string;
  packageName: string;
  description: string;
  price: number;
  monthlyPrice: number;
  annualPrice: number;
  hasMentor: boolean;
  mentorHoursPerMonth: number;
  active: boolean;
  features: string[];
  isMostPopular?: boolean;
  badge?: string;
}

export interface PackageFeature {
  id: number;
  featureName: string;
  description: string;
  included: boolean;
  active: boolean;
  createdAt: string;
}

export interface PackageComparisonDTO {
  packageId: number;
  packageName: string;
  packageCode: string;
  monthlyPrice: number;
  annualPrice: number;
  hasMentor: boolean;
  mentorHoursPerMonth: number;
  description: string;
  features: PackageFeatureDTO[];
  isMostPopular: boolean;
  badge?: string;
}

export interface PackageFeatureDTO {
  featureName: string;
  included: boolean;
  description?: string;
}

// Subscription Types
export interface Subscription {
  id: number;
  userId: number;
  packageId: number;
  packageName: string;
  packageCode: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  paidAmount: number;
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
  mentorHoursUsed: number;
  mentorHoursTotal: number;
  active: boolean;
}

// Request/Response Types
export interface CreatePackageRequest {
  packageCode: string;
  packageName: string;
  description: string;
  price: number;
  monthlyPrice: number;
  annualPrice: number;
  hasMentor: boolean;
  mentorHoursPerMonth: number;
}

export interface CreateSubscriptionRequest {
  userId: number;
  packageId: number;
  billingCycle: BillingCycle;
}

// Component Props
export interface PackageCardProps {
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
