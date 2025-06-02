// List of Imports
import { JwtPayload } from 'jsonwebtoken';
import { Container, Service, Inject } from 'typedi';
import { Request, Response, NextFunction } from "express";
import { TransactionService } from '@services/transactions/transaction.service';


/**
 * Transaction controller logic
 */
@Service()
export class TransactionController {
  /**
   * Constructor method
   */
  constructor(
    @Inject(() => TransactionService)
    private readonly transactionService: TransactionService
  ) {}


  /**
   * Get all Transactions.
   * @param req - Express request with user data.
   * @param res - Express response to return the transactions or error.
   * @param next - NextFunction error handler.
   * @returns JSON response with list of transactions or error.
   */
  async getTransactionsByUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user = req.user as JwtPayload;
      if (!user?.id) {
        return res.status(400).json({ message: 'User ID missing in request.' });
      }

      const transactions = await this.transactionService.getByUser(user.id);
      return res.json(transactions);
    } catch (error) {
      next(error);
    }
  }
}