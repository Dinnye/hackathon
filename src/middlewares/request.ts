import { NextFunction, Request, Response } from "express";
import joi from "joi";
import { statuses } from "../config/statuses";

export const validateSchema = (schema: joi.ObjectSchema) =>
(req: Request , res: Response, next: NextFunction): Response | undefined | void => {
  try {
    const { error } = schema.validate(req);

    const valid = error == null;

    if (valid) {
      return next();
    } {
      const { details } = error;
      const message = details.map(i => i.message).join(",");
      res.status(statuses.unprocassable_entity).json({
        status: false, meta: {},
        errors: [{ message, code: "BODY REQUEST" }],
      });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};

export default validateSchema;
