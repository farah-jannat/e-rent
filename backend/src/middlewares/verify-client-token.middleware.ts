import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "@fvoid/shared-lib";

// Define the shape of your JWT payload
type LandlordJWTPayload = {
  id: string ;
  email: string;
  name: string;
  exp: number;
};

// Extend Request to include the user property
declare global {
  namespace Express {
    interface Request {
      landlord?: LandlordJWTPayload;
    }
  }
}

export const verifyClientToken = (secret: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.bearerToken;

    if (!bearerToken) {
      throw new NotAuthorizedError();
    }

    try {
      const [bearer, jwtToken] = bearerToken.split(" ");

      if (bearer !== "Bearer" || !jwtToken) {
        throw new NotAuthorizedError();
      }

      // Verify token using the passed secret
      const payload = jwt.verify(jwtToken, secret) as LandlordJWTPayload;

      req.landlord = payload;
      next();
    } catch (error) {
      throw new NotAuthorizedError();
    }
  };
};