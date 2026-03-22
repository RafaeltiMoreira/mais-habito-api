import db from "../database/connection";
import { TaskCompletion } from "../models/TaskCompletion";

export const taskCompletionRepository = {
  async create(data: {
    user_id: string;
    task_id: number;
  }): Promise<TaskCompletion> {
    const result = await db.raw(
      `
      INSERT INTO task_completions (user_id, task_id, completed_at)
      VALUES (?, ?, NOW())
      RETURNING *
    `,
      [data.user_id, data.task_id]
    );
    return result.rows[0];
  },

  async findByUserId(userId: string): Promise<TaskCompletion[]> {
    const result = await db.raw(
      `
      SELECT * FROM task_completions
      WHERE user_id = ?
      ORDER BY completed_at DESC
    `,
      [userId]
    );
    return result.rows;
  },

  async findByUserIdToday(userId: string): Promise<TaskCompletion[]> {
    const result = await db.raw(
      `
      SELECT * FROM task_completions
      WHERE user_id = ? 
      AND completed_at >= CURRENT_DATE 
      AND completed_at < CURRENT_DATE + INTERVAL '1 day'
    `,
      [userId]
    );
    return result.rows;
  },

  async findByUserAndTaskToday(userId: string, taskId: number): Promise<TaskCompletion | null> {
    const result = await db.raw(
      `
      SELECT * FROM task_completions
      WHERE user_id = ?
      AND task_id = ?
      AND completed_at >= CURRENT_DATE
      AND completed_at < CURRENT_DATE + INTERVAL '1 day'
      ORDER BY completed_at DESC
      LIMIT 1
    `,
      [userId, taskId]
    );

    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await db.raw(`DELETE FROM task_completions WHERE id = ? RETURNING id`, [id]);
    return result.rows.length > 0;
  }
};
