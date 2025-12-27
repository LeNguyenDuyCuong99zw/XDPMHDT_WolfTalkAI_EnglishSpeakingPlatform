import { IAdminPlanPort, Plan, UpdatePlanDto } from './GetPlansUseCase';

export class UpdatePlanUseCase {
  constructor(private readonly planPort: IAdminPlanPort) {}

  async execute(id: string, data: UpdatePlanDto): Promise<Plan> {
    if (!id) {
      throw new Error('Plan ID is required');
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error('Price must be positive');
    }

    return await this.planPort.updatePlan(id, data);
  }
}
