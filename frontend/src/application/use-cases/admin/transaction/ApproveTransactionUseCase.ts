import { IAdminTransactionPort, Transaction, TransactionStatus } from './GetTransactionsUseCase';

export class ApproveTransactionUseCase {
  constructor(private readonly transactionPort: IAdminTransactionPort) {}

  async execute(transactionId: string, adminId: string, notes?: string): Promise<Transaction> {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }
    if (!adminId) {
      throw new Error('Admin ID is required');
    }

    // Get transaction to verify status
    const transaction = await this.transactionPort.getTransactionById(transactionId);
    
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be approved');
    }

    return await this.transactionPort.approveTransaction(transactionId, adminId, notes);
  }
}
