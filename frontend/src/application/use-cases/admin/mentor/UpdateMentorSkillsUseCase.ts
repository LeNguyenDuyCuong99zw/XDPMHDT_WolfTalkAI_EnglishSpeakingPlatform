import { MentorRepository } from '../../../../infrastructure/repositories/MentorRepository';
import { UpdateMentorSkillsDTO } from '../../../dto/MentorDTO';

export class UpdateMentorSkillsUseCase {
  constructor(private mentorRepository: MentorRepository) {}

  async execute(mentorId: string, data: UpdateMentorSkillsDTO): Promise<void> {
    if (!data.skills || data.skills.length === 0) {
      throw new Error('At least one skill is required');
    }

    await this.mentorRepository.updateSkills(mentorId, data);
  }
}
