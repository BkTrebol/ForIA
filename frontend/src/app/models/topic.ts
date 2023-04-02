export interface Topic {
  id: number;
  category_id: number;
  user_id: number;
  title: string;
  description: string;
  can_post: boolean;
  can_mod: boolean;
  created_at: string;
  updated_at: string;
}
