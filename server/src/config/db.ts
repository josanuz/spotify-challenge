/**
 * This file reads database configuration from environment variables
 * and provides a default configuration for connecting to a PostgreSQL database.
 */
import { PoolConfig } from 'pg';

export const DataBaseConfig: PoolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'podcast',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: parseInt(process.env.DB_MAX_CLIENTS || '10'),
    maxUses: 10,
    application_name: process.env.DB_APP_NAME || 'audiobooks-app',
};
