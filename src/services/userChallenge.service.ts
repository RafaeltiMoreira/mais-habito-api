import { BadRequestError, NotFoundError } from "../errors/AppError";
import { userChallengeRepository } from "../repositories/userChallengeRepository";
import { challengeTemplateRepository } from "../repositories/challengeTemplateRepository";

export const userChallengeService = {
  async acceptChallenge(userId: string, templateId: number) {
    const template = await challengeTemplateRepository.findById(templateId);
    if (!template) {
      throw new NotFoundError("Challenge Template not found");
    }

    const active = await userChallengeRepository.findActiveByUserId(userId);
    if (active) {
      throw new BadRequestError("Você já possui um desafio ativo");
    }

    return await userChallengeRepository.create(userId, templateId);
  },

  async getActiveChallenge(userId: string) {
    const challenge = await userChallengeRepository.findActiveWithTemplateByUserId(userId);
    return challenge || null;
  },

  async listChallenges(userId: string) {
    return await userChallengeRepository.findByUserId(userId);
  },

  async completeChallenge(userId: string, challengeId: number) {
    // Note: completion validation ideally checks if all necessary tasks are done.
    // Simplifying this for the gamification flow.
    const completed = await userChallengeRepository.complete(challengeId);
    if (!completed) throw new NotFoundError("Challenge not found");
    return completed;
  },

  async abandonChallenge(userId: string, challengeId: number) {
    const abandoned = await userChallengeRepository.abandon(challengeId);
    if (!abandoned) throw new NotFoundError("Challenge not found");
    return abandoned;
  },

  async updateNotes(userId: string, challengeId: number, notes: string) {
    const updated = await userChallengeRepository.updateNotes(challengeId, notes);
    if (!updated) throw new NotFoundError("Challenge not found");
    return updated;
  }
};
