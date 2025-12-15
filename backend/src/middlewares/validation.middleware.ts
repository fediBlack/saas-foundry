import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { sendErrorResponse } from "../utils/errors";

export const validateBody =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };

export const validateParams =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync(req.params);
      Object.assign(req.params, validated);
      next();
    } catch (error) {
      sendErrorResponse(res, error);
    }
  };
