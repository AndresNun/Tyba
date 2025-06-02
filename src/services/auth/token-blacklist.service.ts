// List of Imports
import { Service } from 'typedi';
import { RedisService } from '@config/database/redis/redis';

/**
 * Token Blacklist Service
 */
@Service()
export class BlacklistTokenService {
    private redis = RedisService.getInstance().getClient();

    /**
     * Add a Token to the blacklist
     * @param token Token to blacklist
     * @param ttl Expiration time in seconds
     */
    public async blacklistToken(token: string, ttl: number): Promise<void> {
        try {
            await this.redis.set(`blacklist:${token}`, '1', 'EX', ttl);
        } catch (err) {
            console.error('Failed to blacklist token:', err);
            throw err;
        }
    }

    /**
     * Check if a Token is in the blacklist
     * @param token Token to check
     * @returns True if token is in the blacklist
     */
    public async isTokenBlacklisted(token: string): Promise<boolean> {
        try {
            const result = await this.redis.get(`blacklist:${token}`);
            return result === '1';
        } catch (err) {
            console.error('Failed to check token:', err);
            return false;
        }
    }
}