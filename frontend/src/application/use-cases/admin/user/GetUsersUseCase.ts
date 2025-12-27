import { UserRepository } from '../../../../infrastructure/repositories/UserRepository';
import { PaginationParams, PaginatedResponse } from '../../../../shared/types/common.types';
import { UserDTO } from '../../../dto/UserDTO';

export class GetUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResponse<UserDTO>> {
    return this.userRepository.findAll(params);
  }
}
