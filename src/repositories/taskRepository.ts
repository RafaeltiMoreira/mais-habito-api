import db from "../database/connection";
import { Task } from "../models/Task";

export const taskRepository = {
  async create(data: {
    user_id: string;
    challenge_template_id?: number | null;
    title: string;
    description?: string | null;
    points: number;
    is_daily_routine: boolean;
  }): Promise<Task> {
    const result = await db.raw(
      `
      INSERT INTO tasks (user_id, challenge_template_id, title, description, points, is_daily_routine)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `,
      [
        data.user_id,
        data.challenge_template_id || null,
        data.title,
        data.description || null,
        data.points,
        data.is_daily_routine
      ]
    );
    return result.rows[0];
  },

  async findById(id: number): Promise<Task | null> {
    const result = await db.raw(`SELECT * FROM tasks WHERE id = ?`, [id]);
    return result.rows[0] || null;
  },

  async findByUserId(userId: string): Promise<Task[]> {
    const result = await db.raw(
      `
      SELECT * FROM tasks
      WHERE user_id = ?
      ORDER BY created_at ASC
    `,
      [userId]
    );
    return result.rows;
  },

  async update(id: number, data: Partial<Task>): Promise<Task | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.title !== undefined) {
      fields.push("title = ?");
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push("description = ?");
      values.push(data.description);
    }
    if (data.points !== undefined) {
      fields.push("points = ?");
      values.push(data.points);
    }
    if (data.is_daily_routine !== undefined) {
      fields.push("is_daily_routine = ?");
      values.push(data.is_daily_routine);
    }

    fields.push("updated_at = NOW()");
    if (fields.length === 1) return this.findById(id);

    values.push(id);

    const result = await db.raw(
      `
      UPDATE tasks
      SET ${fields.join(", ")}
      WHERE id = ?
      RETURNING *
    `,
      values
    );
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await db.raw(`DELETE FROM tasks WHERE id = ? RETURNING id`, [id]);
    return result.rows.length > 0;
  },

  async getCompletionCount(taskId: number): Promise<number> {
    const result = await db.raw(
      `SELECT COUNT(*)::int as count FROM task_completions WHERE task_id = ?`,
      [taskId]
    );
    return result.rows[0]?.count || 0;
  }
};