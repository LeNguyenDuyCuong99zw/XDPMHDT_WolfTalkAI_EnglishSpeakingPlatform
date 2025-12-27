import { MentorRepository } from '../../../../infrastructure/repositories/MentorRepository';
import { PaginationParams, PaginatedResponse } from '../../../../shared/types/common.types';
import { MentorDTO } from '../../../dto/MentorDTO';

export class GetMentorsUseCase {
  constructor(private mentorRepository: MentorRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResponse<MentorDTO>> {
    return this.mentorRepository.findAll(params);
  }
}
