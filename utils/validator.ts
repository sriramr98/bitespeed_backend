import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const requestBodyValidator = Joi.object({
    email: Joi.string().email(),
    //this is just basic phone number validation, in prod, we'll need a more robust validation
    phoneNumber: Joi.string().pattern(/^\d{10}$/),
}).or('email', 'phoneNumber')

const validator = (req: Request, res: Response, next: NextFunction) => {
    const { error } = requestBodyValidator.validate(req.body);
    if (error) {
        return res.status(400).json({
            error: error.details[0].message,
        });
    }
    next();
}

export default validator;