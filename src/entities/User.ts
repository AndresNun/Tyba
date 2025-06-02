// List of Imports
import { Length } from 'class-validator';
import { Transaction } from './Transaction';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';


/**
 * Users Entity
 */
@Entity('users')  
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToMany(() => Transaction, transaction => transaction.user)
    transactions!: Transaction[];

    /**
     * User's username
     */
    @Column({ length: 100, unique: true })
    @Length(3, 20)
    username!: string;

    /**
     * User's email
     */
    @Column({ length: 100, unique: true })
    email!: string;

    /**
     * User's hash password
     */
    @Column({ length: 100 })
    @Length(6, 100)
    password!: string;

    /**
     * Date of creation of the user
     */
    @CreateDateColumn()
    createdAt!: Date;

    /**
     * Date of last update of the user
     */
    @UpdateDateColumn()
    updatedAt!: Date;
}