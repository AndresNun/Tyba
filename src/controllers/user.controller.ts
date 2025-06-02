// List of Imports
import { Container, Service } from 'typedi';
import { Request, Response, NextFunction } from "express";
import { UserService } from "@services/user/user.service";

/**
 * User controller logic
 */
@Service()
export class UserController {
  /**
   * Constructor method
   * @param userService User service injected 
   */
  constructor(private userService: UserService) {}

  /**
   * Create new User entity.
   * @param req - Express request with User data.
   * @param res - Express response to return the created User or error.
   * @param next - NextFunction error handler.
   * @returns JSON response with created User or error message.
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.create(req.body);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a user by ID.
   * @param req - Express request with User ID.
   * @param res - Express response with user data or 404 if not found.
   * @param next - NextFunction error handler.
   * @returns JSON response with User or not found message.
   */
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      // Handle data structure
      const idParam = req.params.id;
      const id = Number(idParam);

      const user = await this.userService.getUserById(id);
      return user
        ? res.json(user)
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a User by email.
   * @param req - Express request with email in data.
   * @param res - Express response with User data or 404 if not found.
   * @param next - NextFunction error handler.
   * @returns JSON response with User or not found message.
   */
  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ message: "Email query parameter is required" });
      }
      const user = await this.userService.getUserByEmail(email);
      return user
        ? res.json(user)
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all Users.
   * @param _req - Express request (not used).
   * @param res - Express response with list of all Users.
   * @param next - NextFunction error handler.
   * @returns JSON response with array of Users.
   */
  async getAllUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }
}