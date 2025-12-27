export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // days
  features: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlanDto {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
}

export interface UpdatePlanDto {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: string[];
  isActive?: boolean;
}

export interface IAdminPlanPort {
  getPlans(): Promise<Plan[]>;
  getPlanById(id: string): Promise<Plan>;
  createPlan(data: CreatePlanDto): Promise<Plan>;
  updatePlan(id: string, data: UpdatePlanDto): Promise<Plan>;
  deletePlan(id: string): Promise<void>;
}

export class GetPlansUseCase {
  constructor(private readonly planPort: IAdminPlanPort) {}

  async execute(): Promise<Plan[]> {
    return await this.planPort.getPlans();
  }
}
