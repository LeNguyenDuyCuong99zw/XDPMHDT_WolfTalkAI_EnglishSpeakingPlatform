export interface PlanDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  features: PlanFeatureDTO[];
  hasMentor: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFeatureDTO {
  name: string;
  included: boolean;
}

export interface CreatePlanDTO {
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  features: PlanFeatureDTO[];
  hasMentor: boolean;
}

export interface UpdatePlanDTO {
  name?: string;
  description?: string;
  price?: number;
  features?: PlanFeatureDTO[];
  isActive?: boolean;
}
