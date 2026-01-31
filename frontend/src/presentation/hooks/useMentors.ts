import { useState, useEffect } from "react";
import { apiClient } from "../../services/api";

// Types
interface MentorResponse {
  items: any[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Mock implementations - replace with real use cases when available
const getMentorsUseCase = {
  execute: async (params: {
    page: number;
    limit: number;
    search: string;
  }): Promise<MentorResponse> => {
    const response = await apiClient.get<MentorResponse>(
      `/admin/mentors?page=${params.page}&limit=${params.limit}&search=${params.search}`,
    );
    return response;
  },
};

const mentorRepository = {
  approve: async (mentorId: string) => {
    await apiClient.post(`/admin/mentors/${mentorId}/approve`, {});
  },
  reject: async (mentorId: string) => {
    await apiClient.post(`/admin/mentors/${mentorId}/reject`, {});
  },
};

const updateMentorSkillsUseCase = {
  execute: async (
    mentorId: string,
    data: { skills: { name: string; level: string }[] },
  ) => {
    await apiClient.put(`/admin/mentors/${mentorId}/skills`, data);
  },
};

export const useMentors = () => {
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMentors = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMentorsUseCase.execute({
        page,
        limit: pagination.limit,
        search,
      });

      setMentors(response.items);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch mentors");
    } finally {
      setLoading(false);
    }
  };

  const approveMentor = async (mentorId: string) => {
    try {
      await mentorRepository.approve(mentorId);
      await fetchMentors(pagination.page, searchQuery);
    } catch (err: any) {
      throw new Error(err.message || "Failed to approve mentor");
    }
  };

  const rejectMentor = async (mentorId: string) => {
    try {
      await mentorRepository.reject(mentorId);
      await fetchMentors(pagination.page, searchQuery);
    } catch (err: any) {
      throw new Error(err.message || "Failed to reject mentor");
    }
  };

  const updateSkills = async (
    mentorId: string,
    skills: { name: string; level: string }[],
  ) => {
    try {
      await updateMentorSkillsUseCase.execute(mentorId, { skills });
      await fetchMentors(pagination.page, searchQuery);
    } catch (err: any) {
      throw new Error(err.message || "Failed to update skills");
    }
  };

  useEffect(() => {
    fetchMentors(1, searchQuery);
  }, [searchQuery]);

  return {
    mentors,
    loading,
    error,
    pagination,
    searchQuery,
    setSearchQuery,
    fetchMentors,
    approveMentor,
    rejectMentor,
    updateSkills,
  };
};
