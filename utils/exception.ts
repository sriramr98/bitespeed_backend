export interface AppError {
    message: string;
    errorCode?: string;
}

export default abstract class BaseException extends Error {
    private errorCode: string | undefined;

    constructor(message: string, errorCode?: string) {
        super(message);
        this.errorCode = errorCode;
        Object.setPrototypeOf(this, BaseException.prototype);
    }
    getError(): AppError {
        return {
            message: this.message,
            errorCode: this.errorCode,
        };
    }
    abstract getStatusCode(): number;
}
