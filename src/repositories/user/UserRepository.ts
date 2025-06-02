// List of Import
import { User } from "@entities/User";
import { Service, Inject } from "typedi";
import { DataSource, Repository } from "typeorm";
import { IUserRepository } from "./IUserRepository";
import { InjectionTokens } from "@common/InyectionToken";

/**
 * Interface implementation
 */
@Service(InjectionTokens.IUserRepository)
export class UserRepository implements IUserRepository {
    private readonly userRepository: Repository<User>;

    /**
     * Constructor method
     */
    constructor(@Inject(() => DataSource) private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }


    /**
     * Creates and saves a new user entity in the database.
     * 
     * @param user - Partial User's data.
     * @returns Create and save new User entity.
     */
    async create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }
    
    /**
     * Get User by ID
     * 
     * @param id - User's ID.
     * @returns User associated with the given ID, or null.
     */
    async getById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }
    
    /**
     * Get User by email
     * 
     * @param email - User's email.
     * @returns User associated with the given email, or null.
     */
    async getByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }
    
    /**
     * Get all the users
     * 
     * @returns All users, or empty array.
     */
    async getAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}