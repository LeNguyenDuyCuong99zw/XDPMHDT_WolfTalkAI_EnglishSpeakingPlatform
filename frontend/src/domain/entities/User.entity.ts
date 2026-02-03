export enum UserRole {
  ADMIN = 'Admin',
  MENTOR = 'Mentor',
  USER = 'User',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export class User {
  constructor(
    public id: string,
    public email: string,
    public fullName: string,
    public role: UserRole,
    public status: UserStatus,
    public createdAt: Date,
    public updatedAt: Date,
    public avatar?: string,
    public phoneNumber?: string
  ) {}

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isMentor(): boolean {
    return this.role === UserRole.MENTOR;
  }

  isLearner(): boolean {
    return this.role === UserRole.USER;
  }

  activate(): void {
    this.status = UserStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.status = UserStatus.INACTIVE;
    this.updatedAt = new Date();
  }

  suspend(): void {
    this.status = UserStatus.SUSPENDED;
    this.updatedAt = new Date();
  }
}
