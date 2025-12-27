import { UserRepository } from '../../../../infrastructure/repositories/UserRepository';

export class DeactivateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    await this.userRepository.deactivate(userId);
  }
}
    