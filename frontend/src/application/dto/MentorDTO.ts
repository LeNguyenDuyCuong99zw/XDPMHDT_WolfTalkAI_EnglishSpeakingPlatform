export interface MentorDTO {
  id: string;
  userId: string;
  user: {
    fullName: string;
    email: string;
    avatar?: string;
  };
  bio: string;
  experience: number;
  rating: number;
  totalSessions: number;
  status: 'pending' | 'approved' | 'rejected';
  skills: SkillDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface SkillDTO {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface CreateMentorDTO {
  userId: string;
  bio: string;
  experience: number;
  skills: { name: string; level: string }[];
}

export interface UpdateMentorSkillsDTO {
  skills: { name: string; level: string }[];
}
