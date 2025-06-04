/**
 * Application-specific error classes for handling different types of errors.
 * Each class extends the base AppError class and sets a specific HTTP status code.
 */
export class AppError extends Error {
    statusCode: number;

    /**
     * Constructs a new AppError instance.
     * @param message The message to display for the error.
     * @param statusCode HTTP status code associated with the error, default is 500 (Internal Server Error).
     * @param cause Optional cause of the error, can be another Error instance.
     */
    constructor(message: string, statusCode = 500, cause?: Error) {
        super(message, { cause });
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
// Classes are selfdescriptive https://http.cat/ or https://http.dog/ for further information!
export class NotFoundError extends AppError {
    constructor(message = 'Not Found', cause?: Error) {
        super(message, 404, cause);
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad Request', cause?: Error) {
        super(message, 400, cause);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', cause?: Error) {
        super(message, 401, cause);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', cause?: Error) {
        super(message, 403, cause);
    }
}

export class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error', cause?: Error) {
        super(message, 500, cause);
    }
}
