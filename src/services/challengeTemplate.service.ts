import { NotFoundError } from "../errors/AppError";
import { challengeTemplateRepository } from "../repositories/challengeTemplateRepository";

export const challengeTemplateService = {
  async listAll() {
    return await challengeTemplateRepository.findAll();
  },

  async getById(id: number) {
    const template = await challengeTemplateRepository.findById(id);
    if (!template) {
      throw new NotFoundError("Challenge Template not found");
    }
    return template;
  },

  async createTemplate(data: { title: string; description: string; duration_days: number }) {
    const templates = await challengeTemplateRepository.findAll();
    if (templates.length >= 10) {
      throw new Error("Limite de 10 desafios atingido. Exclua algum para criar um novo.");
    }
    if (!data.title || !data.duration_days) {
      throw new Error("Título e duração são obrigatórios");
    }
    return await challengeTemplateRepository.create(data);
  },

  async deleteTemplate(id: number) {
    const template = await challengeTemplateRepository.findById(id);
    if (!template) {
      throw new NotFoundError("Challenge Template not found");
    }
    const deleted = await challengeTemplateRepository.delete(id);
    return deleted;
  }
};
