export interface User {
  id: string;
  name: string;
  profile_picture: string | null;
  points: number;
  current_streak: number;
  max_streak: number;
  created_at: Date;
  updated_at: Date;
}