import db from "../database/connection";
import { UserChallenge } from "../models/UserChallenge";

export const userChallengeRepository = {
  async create(userId: string, templateId: number): Promise<UserChallenge> {
    const result = await db.raw(
      `
      INSERT INTO user_challenges (user_id, template_id, status)
      VALUES (?, ?, 'ACTIVE')
      RETURNING *
    `,
      [userId, templateId]
    );
    return result.rows[0];
  },

  async findActiveByUserId(userId: string): Promise<UserChallenge | null> {
    const result = await db.raw(
      `
      SELECT * FROM user_challenges
      WHERE user_id = ? AND status = 'ACTIVE'
      LIMIT 1
    `,
      [userId]
    );
    return result.rows[0] || null;
  },

  async findActiveWithTemplateByUserId(userId: string): Promise<any | null> {
    const result = await db.raw(
      `
      SELECT 
        uc.*,
        json_build_object(
          'id', ct.id,
          'title', ct.title,
          'description', ct.description,
          'duration_days', ct.duration_days
        ) as template
      FROM user_challenges uc
      JOIN challenge_templates ct ON uc.template_id = ct.id
      WHERE uc.user_id = ? AND uc.status = 'ACTIVE'
      LIMIT 1
    `,
      [userId]
    );
    return result.rows[0] || null;
  },

  async findByUserId(userId: string): Promise<any[]> {
    const result = await db.raw(
      `
      SELECT 
        uc.*,
        json_build_object(
          'id', ct.id,
          'title', ct.title,
          'description', ct.description,
          'duration_days', ct.duration_days
        ) as template
      FROM user_challenges uc
      JOIN challenge_templates ct ON uc.template_id = ct.id
      WHERE uc.user_id = ?
      ORDER BY uc.start_date DESC
    `,
      [userId]
    );
    return result.rows;
  },

  async complete(id: number): Promise<UserChallenge | null> {
    const result = await db.raw(
      `
      UPDATE user_challenges
      SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW()
      WHERE id = ?
      RETURNING *
    `,
      [id]
    );
    return result.rows[0] || null;
  },

  async abandon(id: number): Promise<UserChallenge | null> {
    const result = await db.raw(
      `
      UPDATE user_challenges
      SET status = 'ABANDONED', updated_at = NOW()
      WHERE id = ?
      RETURNING *
    `,
      [id]
    );
    return result.rows[0] || null;
  },

  async updateNotes(id: number, notes: string): Promise<UserChallenge | null> {
    const result = await db.raw(
      `
      UPDATE user_challenges
      SET notes = ?, updated_at = NOW()
      WHERE id = ?
      RETURNING *
    `,
      [notes, id]
    );
    return result.rows[0] || null;
  }
};
