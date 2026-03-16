import db from "../database/connection";
import { ChallengeTemplate } from "../models/ChallengeTemplate";

export const challengeTemplateRepository = {
  async findAll(): Promise<ChallengeTemplate[]> {
    const result = await db.raw(
      `SELECT * FROM challenge_templates ORDER BY created_at DESC`
    );
    return result.rows;
  },

  async findById(id: number): Promise<ChallengeTemplate | null> {
    const result = await db.raw(
      `SELECT * FROM challenge_templates WHERE id = ?`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(data: { title: string; description: string; duration_days: number }): Promise<ChallengeTemplate> {
    const result = await db.raw(
      `INSERT INTO challenge_templates (title, description, duration_days) 
       VALUES (?, ?, ?) RETURNING *`,
      [data.title, data.description, data.duration_days]
    );
    return result.rows[0];
  },

  async delete(id: number): Promise<boolean> {
    const result = await db.raw(
      `DELETE FROM challenge_templates WHERE id = ? RETURNING id`,
      [id]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  }
};
