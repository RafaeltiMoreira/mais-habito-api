export interface UserChallenge {
  id: number;
  user_id: string;
  template_id: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  start_date: Date;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
