/**
 * Simple error handler middleware for Express.js applications.
 * Logs the error and sends a JSON response with the error message and status code.
 */
import { Request, Response } from 'express';
import pino from 'pino';
import Environment from '../config/enviroment';

const loggerFactory = () =>
    pino({
        level: 'info',
        enabled: Environment.MODE !== 'test',
    });

const logger = loggerFactory();

/**
 * Interface for error objects that may include a status code.
 * This interface extends the standard Error object to include optional status properties.
 */
interface ErrorWithStatus extends Error {
    status?: number;
    statusCode?: number;
}

/**
 * Error handler middleware function.
 * This middleware captures errors thrown in the application, logs them, and sends a JSON response to the client.
 * @param err The error object that contains the error details.
 * @param req The request object from the Express.js application.
 * @param res The response object from the Express.js application.
 */
const errorHandler = (err: ErrorWithStatus, req: Request, res: Response): void => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    logger.error({
        message,
        status,
    });

    if (err.cause) {
        logger.error('Error cause:', err.cause);
    }

    res.status(status).json({
        error: {
            message,
            status,
        },
    });
};

export default errorHandler;
