// List of Imports
import { Transaction} from "@entities/Transaction";
import { TransactionDto } from "@dtos/transactions/transaction.dt";

/**
 * Transaction Interface
 */
export interface ITransactionRepository {
    save(transaction: TransactionDto): Promise<Transaction>;
    getByUser(userId: number): Promise<Transaction[]>;
}