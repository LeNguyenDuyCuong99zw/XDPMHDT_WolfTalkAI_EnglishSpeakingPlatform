import { useState, useEffect } from "react";

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
