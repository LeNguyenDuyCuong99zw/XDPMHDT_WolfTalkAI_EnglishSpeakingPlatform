import { UserRepository } from '../../../../infrastructure/repositories/UserRepository';

export class ActivateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    await this.userRepository.activate(userId);
  }
}
