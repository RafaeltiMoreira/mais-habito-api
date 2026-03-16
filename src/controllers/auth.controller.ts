import { NextFunction, Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const result = await authService.signup({ name, email, password });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};