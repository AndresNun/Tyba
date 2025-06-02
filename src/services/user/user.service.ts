// List of Imports
import bcrypt from 'bcryptjs';
import { User } from "@entities/User";
import { Service, Inject } from "typedi";
import { InjectionTokens } from '@common/InyectionToken';
import { IUserRepository } from '@repositories/user/IUserRepository';


/**
 * User service
 */
@Service()
export class UserService {

  /**
   * Constructor method
   */
  constructor(
    @Inject(InjectionTokens.IUserRepository)
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Create a new User Entity.
   * @param user - Partial User data.
   * @returns Created User entity.
   */
  async create(user: Partial<User>): Promise<User> {
    // Hashing password
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return this.userRepository.create(user);
  }

  /**
   * Get User by ID.
   * @param id - User ID.
   * @returns User or null if not found.
   */
  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  /**
   * Get User by email.
   * @param email - User email.
   * @returns User or null if not found.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getByEmail(email);
  }

  /**
   * Get all users.
   * @returns Array of all User entities.
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAll();
  }
}