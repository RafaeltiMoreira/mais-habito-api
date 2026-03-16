import express from 'express';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorHandler';
import userRoutes from './routes/userRoutes';
import challengeTemplateRoutes from './routes/challengeTemplateRoutes';
import userChallengeRoutes from './routes/userChallengeRoutes';
import taskRoutes from './routes/taskRoutes';
import taskCompletionRoutes from './routes/taskCompletionRoutes';
import { startStreakCronJob } from './jobs/streakReset.job';
import cors from 'cors';

const app = express();

// Middlewares globais
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/challenge-templates', challengeTemplateRoutes);
app.use('/api/user-challenges', userChallengeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-completions', taskCompletionRoutes);

app.use(errorHandler);

// Iniciar cron jobs
startStreakCronJob();

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});