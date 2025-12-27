export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum TransactionType {
  SUBSCRIPTION = 'SUBSCRIPTION',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  planId?: string;
  planName?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod: string;
  transactionDate: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedAt?: Date;
  notes?: string;
}

export interface IAdminTransactionPort {
  getTransactions(status?: TransactionStatus): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction>;
  approveTransaction(id: string, adminId: string, notes?: string): Promise<Transaction>;
  rejectTransaction(id: string, adminId: string, reason: string): Promise<Transaction>;
}

export class GetTransactionsUseCase {
  constructor(private readonly transactionPort: IAdminTransactionPort) {}

  async execute(status?: TransactionStatus): Promise<Transaction[]> {
    return await this.transactionPort.getTransactions(status);
  }
}
