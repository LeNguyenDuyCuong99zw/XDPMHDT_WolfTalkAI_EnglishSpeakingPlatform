import { IAdminPlanPort } from './GetPlansUseCase';

export class DeletePlanUseCase {
  constructor(private readonly planPort: IAdminPlanPort) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('Plan ID is required');
    }

    await this.planPort.deletePlan(id);
  }
}
