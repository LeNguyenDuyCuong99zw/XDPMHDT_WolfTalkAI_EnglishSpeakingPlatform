export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: UserDTO;
}

export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  role: 'Admin' | 'Mentor' | 'Learner';
  avatar?: string;
  status?: string;
}
