import { useState, useEffect } from "react";
import { apiClient } from "../../services/api";

// Types
export interface CreatePlanDTO {
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
}

export interface UpdatePlanDTO extends Partial<CreatePlanDTO> {
  isActive?: boolean;
}

// Mock repository - replace with real implementation when available
const planRepository = {
  findAll: async () => {
    return await apiClient.get<any[]>("/admin/plans");
  },
  create: async (data: CreatePlanDTO) => {
    return await apiClient.post("/admin/plans", data);
  },
  update: async (id: string, data: UpdatePlanDTO) => {
    return await apiClient.put(`/admin/plans/${id}`, data);
  },
  delete: async (id: string) => {
    return await apiClient.delete(`/admin/plans/${id}`);
  },
  activate: async (id: string) => {
    return await apiClient.patch(`/admin/plans/${id}/activate`);
  },
  deactivate: async (id: string) => {
    return await apiClient.patch(`/admin/plans/${id}/deactivate`);
  },
};

export const usePlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await planRepository.findAll();
      setPlans(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const createPlan = async (data: CreatePlanDTO) => {
    try {
      await planRepository.create(data);
      await fetchPlans();
    } catch (err: any) {
      throw new Error(err.message || "Failed to create plan");
    }
  };

  const updatePlan = async (id: string, data: UpdatePlanDTO) => {
    try {
      await planRepository.update(id, data);
      await fetchPlans();
    } catch (err: any) {
      throw new Error(err.message || "Failed to update plan");
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await planRepository.delete(id);
      await fetchPlans();
    } catch (err: any) {
      throw new Error(err.message || "Failed to delete plan");
    }
  };

  const togglePlanStatus = async (id: string, isActive: boolean) => {
    try {
      if (isActive) {
        await planRepository.deactivate(id);
      } else {
        await planRepository.activate(id);
      }
      await fetchPlans();
    } catch (err: any) {
      throw new Error(err.message || "Failed to update plan status");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
  };
};
