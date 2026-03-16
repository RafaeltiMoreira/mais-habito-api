import { NextFunction, Response } from "express";
import { taskService } from "../services/task.service";
import { AuthRequest } from "../types/express-extensions";
import { UnauthorizedError } from "../errors/AppError";

export const taskController = {
  createTask: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");

      const { title, description, points, is_daily_routine, challenge_template_id } = req.body;

      const task = await taskService.createTask(req.user.userId, {
        title,
        description,
        points,
        is_daily_routine,
        challenge_template_id
      });

      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },
  listMyTasks: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");

      const tasks = await taskService.listTasks(req.user.userId);

      res.status(200).json(tasks);
    } catch (error) {
      next(error);
    }
  },
  updateTask: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");

      const { taskId } = req.params;
      const { title, description, points, is_daily_routine } = req.body;

      const task = await taskService.updateTask(req.user.userId, Number(taskId), {
        title,
        description,
        points,
        is_daily_routine
      });

      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  },
  deleteTask: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");

      const { taskId } = req.params;

      await taskService.deleteTask(req.user.userId, Number(taskId));

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};