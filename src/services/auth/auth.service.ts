// List of Imports
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '@entities/User';
import { Service, Inject } from 'typedi';
import { authConfig } from '@config/index';
import { LoginDto } from '@dtos/auth/login.dto';
import { UserService } from '@services/user/user.service';
import { UnauthorizedError } from '@utils/errors/unauthorized.error';


/**
 * Authentication Service
 */
@Service()
export class AuthService {
    private readonly dummyHash = '$2a$10$wZ8t5G8h9hWbRfNY/ljxO.QvQH9YiX9p4uYIDZr3YXjvzZQGpkYLa';

    /**
     * Constructor method
     */
    constructor(
        @Inject(() => UserService) 
        private readonly userService: UserService,
    ) {}

    /**
     * User validation
     * 
     * @param dto DTO Valiation.
     * @returns The authenticated User.
     * @throws {UnauthorizedError} If the email is not found or the password is incorrect.
     */
    async validateUser(dto: LoginDto): Promise<User> {
        const user = await this.userService.getUserByEmail(dto.email);
        const hashToCompare = user ? user.password : this.dummyHash;
        const isValid = await bcrypt.compare(dto.password, hashToCompare);

        // User's validation
        if(!user || !isValid) {
            throw new UnauthorizedError('Invalid credentials');
        }
        return user;
    }

    /**
     * Generates a JWT access token.
     *
     * @param {User} user - Authenticated User Entity
     * @returns {{ access_token: string }} - JWT token
     * @throws {Error} - If JWT is not define
     */
    async login(user: User): Promise<{ access_token: string }> {
        // Boundary conditions
        const { jwtConfig } = authConfig.authConfig;
        const { secret, algorithm, expiresIn } = jwtConfig;


        if (!secret) {
            throw new Error('JWT secret is not defined');
          }
        
        // User's data payload
        const payload = {
            id: user.id,
            name: user.username,
            email: user.email,
        };

        // Generated token
        const generatedToken = jwt.sign(payload, secret, {
            algorithm: 'HS256', 
            expiresIn: '1h',
        });
        
        return { access_token: generatedToken };
    }
}
