import crypto from 'crypto';

const Enviroment = {
    JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
    CLIENT_SECRET: process.env.CLIENT_SECRET || null,
    CLIENT_ID: process.env.CLIENT_ID || null,
    REDIRECT_URI: process.env.REDIRECT_URI || 'http://127.0.0.1:8080/auth/callback',
    PORT: parseInt(process.env.PORT || '8080', 10),
    MODE: process.env.NODE_ENV || 'development',
};

export default Enviroment;
