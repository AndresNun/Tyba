// List of Imports
import { Service } from 'typedi';
import { AuthService } from '@services/auth/auth.service';
import { Request, Response, NextFunction } from "express";
import { BlacklistToken } from '@common/enums/blacklist.enum';
import { BlacklistTokenService } from '@services/auth/token-blacklist.service';


/**
 * Expriation variable
 */
const BLACKLIST_DURATION_SECONDS = parseInt(
    process.env.BLACKLIST_DURATION_SECONDS || BlacklistToken.EXPIRATION.toString(), 10
  );
  

/**
 * Auth Controller logic
 */
@Service()
export class AuthController {
    /**
     * Constructor method
     * @param authService User service injected 
     */
    constructor(
        private authService: AuthService,
        private blacklistTokenService: BlacklistTokenService,
    ) {}

    /**
     * Authenticate an User and return JWT Token.
     * 
     * @param loginDto - Login credentials.
     * @returns JWT token if credentials are valid.
     */
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const loginDto = req.body;
            const user = await this.authService.validateUser(loginDto);
            const token = await this.authService.login(user);
            res.status(200).json(token);
        } catch (error) {
            next(error); 
        }
    }

    /**
     * Logout User: JWT token blacklisted.
     * 
     * @param req - Express request, expects JWT.
     * @param res - Express response.
     * @param next - Next function for error handling.
     */
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Get Token from Header
            const header = req.headers.authorization;
            if (!header || !header.startsWith('Bearer ')) {
                throw new Error('Authorization header is missing or malformed');
            }
    
            // Extract Token and Blacklist
            const token = header.substring(7);
            await this.blacklistTokenService.blacklistToken(token, BLACKLIST_DURATION_SECONDS);
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            next(error);
        }
    }
}