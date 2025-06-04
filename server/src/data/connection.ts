import { Pool, PoolClient } from 'pg';
import { DataBaseConfig } from '../config/db';

const pool = new Pool(DataBaseConfig);
/**
 * Creates a connection pool to the PostgreSQL database using the configuration provided.
 * @returns {Promise<PoolClient>} A promise that resolves to a PostgreSQL client.
 */
export const getConnection = async (): Promise<PoolClient> => {
    try {
        const client = await pool.connect();
        return client;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};
