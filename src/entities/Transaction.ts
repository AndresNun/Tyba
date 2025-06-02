// List of Imports
import { User } from './User';
import { TransactionType } from '@common/enums/transaction-type.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';


/**
 * Transactions Entity
 */
@Entity('transactions')  
@Index(['userId'])
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * User ID (Foreign key)
   */
  @Column({ name: 'user_id' })
  userId!: number;


  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /**
   * Transaction type
   */
  @Column({
      type: 'enum',
      enum: TransactionType,
    })
    type!: TransactionType;

  /**
   * City's name
   */
  @Column({ nullable: true })
  location?: string;

  /**
   * Latitude column
   */
  @Column({ type: 'float', nullable: true })
  latitude?: number;

  /**
   * Longitude column
   */
  @Column({ type: 'float', nullable: true })
  longitude?: number;

  /**
   * Date of creation of the Transaction
   */
  @CreateDateColumn()
  createdAt!: Date;
}