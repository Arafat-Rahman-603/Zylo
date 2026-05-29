import type { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error("Server Error:", err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err instanceof Error ? err.message : (typeof err === "string" ? err : "Internal Server Error"),
    ...(process.env.NODE_ENV === "development" && err instanceof Error && { stack: err.stack }),
  });
};