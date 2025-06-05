import mariadb from 'mariadb';
import { DataBaseConfig } from '../config/db';

const pool = mariadb.createPool(DataBaseConfig);
/**
 * Creates a connection pool to the MariaDB database using the configuration provided.
 * @returns {Promise<PoolClient>} A promise that resolves to a MariaDB Pool client.
 */
export const getConnection = async () => {
    try {
        return await pool.getConnection();
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};
