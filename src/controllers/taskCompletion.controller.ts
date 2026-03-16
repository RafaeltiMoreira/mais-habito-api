import { NextFunction, Response } from "express";
import { taskCompletionService } from "../services/taskCompletion.service";
import { AuthRequest } from "../types/express-extensions";
import { UnauthorizedError } from "../errors/AppError";

export const taskCompletionController = {
  completeTask: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");

      const { task_id } = req.body;

      const completion = await taskCompletionService.completeTask(
        req.user.userId,
        {
          task_id: Number(task_id),
        },
      );

      res.status(201).json(completion);
    } catch (error) {
      next(error);
    }
  },
};
