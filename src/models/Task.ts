export interface Task {
  id: number;
  user_id: string;
  challenge_template_id: number | null;
  title: string;
  description: string | null;
  points: number;
  is_daily_routine: boolean;
  created_at: Date;
  updated_at: Date;
}