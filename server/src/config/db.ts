/**
 * This file reads database configuration from environment variables
 * and provides a default configuration for connecting to a maria database.
 */
import mariadiadb from 'mariadb';

export const DataBaseConfig: mariadiadb.PoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'app_user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'podcast',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};
