import { IAdminTransactionPort, Transaction, TransactionStatus } from './GetTransactionsUseCase';

export class RejectTransactionUseCase {
  constructor(private readonly transactionPort: IAdminTransactionPort) {}

  async execute(transactionId: string, adminId: string, reason: string): Promise<Transaction> {
    if (!transactionId) {
      throw new Error('Transaction ID is required');
    }
    if (!adminId) {
      throw new Error('Admin ID is required');
    }
    if (!reason || reason.trim().length === 0) {
      throw new Error('Rejection reason is required');
    }

    // Get transaction to verify status
    const transaction = await this.transactionPort.getTransactionById(transactionId);
    
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be rejected');
    }

    return await this.transactionPort.rejectTransaction(transactionId, adminId, reason);
  }
}
