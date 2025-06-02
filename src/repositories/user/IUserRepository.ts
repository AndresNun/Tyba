// List of Imports
import { User } from "@entities/User";


/**
 * User Interface
 */
export interface IUserRepository {
    create(user: Partial<User> ): Promise<User>;
    getById(id: number): Promise<User | null>;
    getByEmail(email: string): Promise<User | null>;
    getAll(): Promise<User[]>;
}