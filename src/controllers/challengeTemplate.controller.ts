import { Request, Response, NextFunction } from "express";
import { challengeTemplateService } from "../services/challengeTemplate.service";
import { AuthRequest } from "../types/express-extensions";
import { UnauthorizedError } from "../errors/AppError";

export const challengeTemplateController = {
  listAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const templates = await challengeTemplateService.listAll();
      res.status(200).json(templates);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const { id } = req.params;
      const template = await challengeTemplateService.getById(Number(id));
      res.status(200).json(template);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const { title, description, duration_days } = req.body;
      const template = await challengeTemplateService.createTemplate({ title, description, duration_days });
      res.status(201).json(template);
    } catch (error: any) {
      if (error.message.includes("Limite")) res.status(400).json({ error: error.message });
      else next(error);
    }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const { id } = req.params;
      await challengeTemplateService.deleteTemplate(Number(id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
