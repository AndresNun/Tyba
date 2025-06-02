/**
 * JWT config
 */
export const jwtConfig = {
    secret: process.env.JWT_SECRET,
    algorithm: 'HS256',
    expiresIn: '1h'
};