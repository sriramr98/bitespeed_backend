import { AppError } from "./exception";

interface ApiResponse<T> {
    isSuccess: boolean;
    data: T | null;
    error: AppError | null;
}


class Result<T> {
    private data: T | null;
    private isSuccess = false;
    private error: AppError | null = null;

    private constructor(
        isSuccess: boolean,
        data: T | null = null,
        error: AppError | null = null,
    ) {
        this.data = data;
        this.isSuccess = isSuccess;
        this.error = error;
    }

    static success<T>(data: T): ApiResponse<T> {
        return new Result(true, data).toJSON();
    }

    static failure<T>(err: AppError | null): ApiResponse<T> {
        return new Result<T>(false, null, err).toJSON();
    }

    toJSON(): ApiResponse<T> {
        return {
            data: this.data,
            isSuccess: this.isSuccess,
            error: this.error,
        };
    }
}

export default Result;