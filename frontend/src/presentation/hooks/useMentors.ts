import { useState, useEffect } from "react";

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
