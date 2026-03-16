import cron from 'node-cron';
import db from '../database/connection';

export const startStreakCronJob = () => {
  // Executar todos os dias à meia-noite
  cron.schedule('0 0 * * *', async () => {
    console.log('[Cron Job] Checking and resetting streaks...');
    try {      
      const result = await db.raw(`
        UPDATE users
        SET current_streak = 0
        WHERE id NOT IN (
          SELECT DISTINCT user_id 
          FROM task_completions 
          WHERE completed_at >= CURRENT_DATE - INTERVAL '1 day' 
            AND completed_at < CURRENT_DATE
        ) AND current_streak > 0
        RETURNING id
      `);
      
      console.log(`[Cron Job] Reset streaks for ${result.rows.length} users.`);
    } catch (error) {
      console.error('[Cron Job] Error running streak reset job:', error);
    }
  });

  console.log('[Cron Job] Streak reset job scheduled.');
};
