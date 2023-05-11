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
  last_post?: LastPost;
}

interface LastPost {
  topic: Topic;
  created_at: string;
  updated_at: string;
}

interface Topic {
  id: number;
  title: string;
}