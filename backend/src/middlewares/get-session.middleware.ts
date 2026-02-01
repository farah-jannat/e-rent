import type { Request, Response, NextFunction } from "express";
declare global {
  namespace Express {
    interface Request {
      bearerToken?: string;
    }
  }
}

export const getSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = req.session;

  const jwtToken = session?.jwt ?? "";

  req.bearerToken = `Bearer ${jwtToken}`;

  next();
};
