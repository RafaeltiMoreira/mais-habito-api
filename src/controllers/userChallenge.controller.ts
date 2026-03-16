import { Response, NextFunction } from "express";
import { userChallengeService } from "../services/userChallenge.service";
import { AuthRequest } from "../types/express-extensions";
import { UnauthorizedError } from "../errors/AppError";

export const userChallengeController = {
  acceptChallenge: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const { templateId } = req.body;
      const challenge = await userChallengeService.acceptChallenge(req.user.userId, Number(templateId));
      res.status(201).json(challenge);
    } catch (error) {
      next(error);
    }
  },

  getActiveChallenge: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const activeChallenge = await userChallengeService.getActiveChallenge(req.user.userId);
      res.status(200).json(activeChallenge);
    } catch (error) {
      next(error);
    }
  },

  listChallenges: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const challenges = await userChallengeService.listChallenges(req.user.userId);
      res.status(200).json(challenges);
    } catch (error) {
      next(error);
    }
  },

  completeChallenge: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const { id } = req.params;
      const result = await userChallengeService.completeChallenge(req.user.userId, Number(id));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async abandonChallenge(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const { id } = req.params;
      const result = await userChallengeService.abandonChallenge(req.user.userId, Number(id));
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  updateNotes: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("User not authenticated");
      const { id } = req.params;
      const { notes } = req.body;
      const result = await userChallengeService.updateNotes(req.user.userId, Number(id), notes);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
