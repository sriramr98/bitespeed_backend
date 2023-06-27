import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'

import validator from './utils/validator'
import identify from './handler';
import getSequelize from './db/init';
import asyncHandler from './utils/asyncHandler';
import globalErrorHandler from './utils/globalErrorHandler';

const app = express();
app.use(express.json())
app.use(cors())

const port = 3000;

const sql = getSequelize()

app.post('/identify', validator, asyncHandler(identify));

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    return next(new Error('Route not found'));
})

app.use(globalErrorHandler);

// Start the server
app.listen(port, () => {
    sql.sync();
    console.log(`Server is running on port ${port}`);
});
