import { BadRequestError, NotFoundError } from "../errors/AppError";
import { taskCompletionRepository } from "../repositories/taskCompletionRepository";
import { taskRepository } from "../repositories/taskRepository";
import { userRepository } from "../repositories/userRepository";

export const taskCompletionService = {
  async completeTask(
    userId: string,
    data: { task_id: number; },
  ) {
    const { task_id } = data;

    const task = await taskRepository.findById(task_id);
    if (!task) throw new NotFoundError("Task not found");
    if (task.user_id !== userId) throw new BadRequestError("This task doesn't belong to you");

    const todayCompletions = await taskCompletionRepository.findByUserIdToday(userId);
    const hasCompletedToday = todayCompletions.length > 0;

    const completion = await taskCompletionRepository.create({
      task_id,
      user_id: userId,
    });

    const user = await userRepository.findById(userId);
    if (user) {
        let newStreak = user.current_streak;
        let maxStreak = user.max_streak;
        
        // If they hadn't completed any task today yet, bump streak 
        // Note: checking consecutive days ideally requires looking at yesterday's completions.
        // For gamification simplicity at real-time completion, we increment if this is the FIRST task of the day.
        // An overnight CRON JOB evaluates if they LOST the streak.
        if (!hasCompletedToday) {
            newStreak += 1;
            if (newStreak > maxStreak) {
                maxStreak = newStreak;
            }
        }

        await userRepository.update(userId, {
            points: user.points + task.points,
            current_streak: newStreak,
            max_streak: maxStreak
        });
    }

    return completion;
  },
};