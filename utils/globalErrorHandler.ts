import { Request, Response, NextFunction } from 'express';
import BaseException from './exception';
import Result from './result';

export default (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
): Response => {
    if (err instanceof BaseException) {
        const result = Result.failure(err.getError());
        return res.status(err.getStatusCode() || 500).json(result);
    }
    return res.status(500).json(
        Result.failure({
            message: 'Something went wrong',
        }),
    );
};