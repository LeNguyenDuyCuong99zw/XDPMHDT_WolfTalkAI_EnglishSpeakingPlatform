export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Mentor' | 'Learner';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  fullName: string;
  password: string;
  role: 'Admin' | 'Mentor' | 'Learner';
  phoneNumber?: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  phoneNumber?: string;
  role?: 'Admin' | 'Mentor' | 'Learner';
}
