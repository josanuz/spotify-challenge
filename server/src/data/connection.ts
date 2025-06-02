import { Pool } from 'pg';
import { DataBaseConfig } from '../config/db';

const pool = new Pool(DataBaseConfig);

export const getConnection = async () => {
    try {
        const client = await pool.connect();
        return client;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};
