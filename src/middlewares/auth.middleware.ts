// // List of Imports 
import Container from 'typedi';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtConfig } from '@config/auth/jwt.config';
import { Request, Response, NextFunction } from 'express';
import { BlacklistTokenService } from '@services/auth/token-blacklist.service';


/**
 * Interface: Include User Entity
 */
declare module 'express' {
    export interface Request {
        user?: string | JwtPayload;
    }
}

/**
 * Auth Middleware
 */
export async function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    // Boundary conditions
    const authHeader = req.headers.authorization;

    // Case: Missing header
    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header missing' });
        return;
    }

    // Case: Missing token
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token missing' });
        return;
    }

    // Case: Blacklist verification
    const blacklistService = Container.get(BlacklistTokenService);
    const isBlacklisted = await blacklistService.isTokenBlacklisted(token);
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }

    // Case: Verification
    jwt.verify(token, jwtConfig.secret!, (err, user) => {
        if (err) {
          res.status(403).json({ message: 'Invalid or expired token' });
          return;
        }
        req.user = user;
        next();
    });
}