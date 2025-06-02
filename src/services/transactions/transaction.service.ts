// List of Imports
import { Service, Inject } from "typedi";
import { Transaction } from '@entities/Transaction';
import { InjectionTokens } from "@common/InyectionToken";
import { TransactionDto } from "@dtos/transactions/transaction.dt";
import { ITransactionRepository } from "@repositories/transactions/ITransactionRepository";


/**
 * User service
 */
@Service()
export class TransactionService {

  /**
   * Constructor method
   */
  constructor(
    @Inject(InjectionTokens.ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository
  ) {}


  /**
   * Save Transaction.
   * @param transactionData - Transaction Entity.
   * @returns Save Transaction.
   */
  async save(transactionData: TransactionDto): Promise<Transaction> {
    return this.transactionRepository.save(transactionData);
  }

  /**
   * Get Transaction by User ID.
   * @param userId - User ID to filter transactions.
   * @returns List of Transactions.
   */
  async getByUser(userId: number): Promise<Transaction[]>{
    return this.transactionRepository.getByUser(userId);
  }
}