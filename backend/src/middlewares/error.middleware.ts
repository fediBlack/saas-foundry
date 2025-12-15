import { Request, Response, NextFunction } from "express";
import { sendErrorResponse } from "../utils/errors";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", {
    message: error.message,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
  });

  sendErrorResponse(res, error);
};
