import { BadRequestError, NotFoundError } from "../errors/AppError";
import { taskRepository } from "../repositories/taskRepository";
import { challengeTemplateRepository } from "../repositories/challengeTemplateRepository";
import { userChallengeRepository } from "../repositories/userChallengeRepository";

export const taskService = {
  async createTask(
    userId: string,
    data: {
      title: string;
      description?: string;
      points: number;
      is_daily_routine?: boolean;
      challenge_template_id?: number;
    },
  ) {
    const { title, description, points, is_daily_routine, challenge_template_id } = data;

    if (points <= 0)
      throw new BadRequestError("Points must be greater than zero");

    if (challenge_template_id) {
       const template = await challengeTemplateRepository.findById(challenge_template_id);
       if (!template) throw new NotFoundError("Challenge template not found");

       const activeChallenge = await userChallengeRepository.findActiveByUserId(userId);
       if (!activeChallenge || activeChallenge.template_id !== challenge_template_id) {
           throw new BadRequestError("You are not actively taking this challenge");
       }
    }

    const task = await taskRepository.create({
      user_id: userId,
      challenge_template_id: challenge_template_id || null,
      title,
      description,
      points,
      is_daily_routine: is_daily_routine || false
    });

    return task;
  },

  async listTasks(userId: string) {
    const tasks = await taskRepository.findByUserId(userId);
    const tasksWithCount = await Promise.all(
      tasks.map(async (task) => {
        const count = await taskRepository.getCompletionCount(task.id);
        return { task, completion_count: count };
      })
    );
    return tasksWithCount;
  },

  async updateTask(
    userId: string,
    taskId: number,
    data: {
      title?: string;
      description?: string;
      points?: number;
      is_daily_routine?: boolean;
    }
  ) {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new NotFoundError("Task not found");
    if (task.user_id !== userId) throw new BadRequestError("You don't have permission to update this task");

    if (data.points !== undefined && data.points <= 0)
      throw new BadRequestError("Points must be greater than zero");

    return await taskRepository.update(taskId, data);
  },

  async deleteTask(userId: string, taskId: number) {
    const task = await taskRepository.findById(taskId);
    if (!task) throw new NotFoundError("Task not found");
    if (task.user_id !== userId) throw new BadRequestError("You don't have permission to delete this task");

    await taskRepository.delete(taskId);
  }
};