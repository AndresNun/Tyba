// List of Imports
import { Service, Inject } from "typedi";
import { DataSource, Repository } from "typeorm";
import { Transaction } from "@entities/Transaction";
import { InjectionTokens } from "@common/InyectionToken";
import { ITransactionRepository } from "./ITransactionRepository";
import { TransactionDto } from "@dtos/transactions/transaction.dt";

/**
 * Interface implementation
 */
@Service(InjectionTokens.ITransactionRepository)
export class TransactionRepository implements ITransactionRepository {
    private readonly transactionRepository: Repository<Transaction>;

    /**
     * Constructor method
     */
    constructor(@Inject(() => DataSource) private dataSource: DataSource) {
        this.transactionRepository = this.dataSource.getRepository(Transaction);
    }

    /**
     * Save new Transaction Entity in the database.
     * 
     * @param transaction - Dto Transaction's data.
     * @returns Save new Transaction entity.
     */
    async save(transaction: TransactionDto): Promise<Transaction> {
        return this.transactionRepository.save(transaction);
    }

    /**
     * Get Transactions by the User's ID.
     * 
     * @param userId - User ID to filter transactions.
     * @returns List of Transactions.
     */
    async getByUser(userId: number): Promise<Transaction[]> {
        return this.transactionRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
}