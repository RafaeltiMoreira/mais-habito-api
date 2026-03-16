import { NextFunction, Response } from "express";
import { userService } from "../services/user.service";
import { AuthRequest } from "../types/express-extensions";
import { UnauthorizedError } from "../errors/AppError";

export const userController = {
  getProfile: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User is not authenticated");
      }

      const user = await userService.getProfile(req.user.userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("User is not authenticated");
      }

      const { name, profile_picture, email, currentPassword, newPassword } = req.body;
      const updatedUser = await userService.updateProfile(req.user.userId, {
        name,
        profile_picture,
        email,
        currentPassword,
        newPassword,
      });

      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
};
