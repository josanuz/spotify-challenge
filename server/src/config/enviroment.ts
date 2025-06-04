// This file reads environment variables for application configuration
import crypto from 'crypto';

const Environment = {
    /** Secret for signing JWT TOKENS */
    JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
    /** Spotify Client Secret */
    CLIENT_SECRET: process.env.CLIENT_SECRET || null,
    /** Spotify client ID */
    CLIENT_ID: process.env.CLIENT_ID || null,
    /** Spotify Redirect URL, must match the app configuration one */
    REDIRECT_URI: process.env.REDIRECT_URI || 'http://127.0.0.1:8080/auth/callback',
    /** Application Port default 8080 */
    PORT: parseInt(process.env.PORT || '8080', 10),
    /** Mode Defaults to dev */
    MODE: process.env.NODE_ENV || 'development',
};

export default Environment;
