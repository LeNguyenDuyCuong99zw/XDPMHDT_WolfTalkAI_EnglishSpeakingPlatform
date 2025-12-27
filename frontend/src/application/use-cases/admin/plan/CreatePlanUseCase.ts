import { IAdminPlanPort, Plan } from './GetPlansUseCase';

export interface CreatePlanDto {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
}

export class CreatePlanUseCase {
  constructor(private readonly planPort: IAdminPlanPort) {}

  async execute(data: CreatePlanDto): Promise<Plan> {
    // Validate
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Plan name is required');
    }
    if (data.price < 0) {
      throw new Error('Price must be positive');
    }
    if (data.duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    return await this.planPort.createPlan(data);
  }
}
