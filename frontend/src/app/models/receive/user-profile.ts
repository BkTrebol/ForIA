export interface PublicUserProfile {
  id: number;
  nick: string;
  email: string;
  location: string;
  birthday: string;
  avatar: string | null;
  rol: string;
  created_at: string;
  updated_at: string;
  can_pm: boolean;
  is_verified: boolean;
  last_post?: {
    topic_id: number;
    topic_title: string;
    topic: { title: string };
    created_at: string;
    updated_at: string;
  };
}
