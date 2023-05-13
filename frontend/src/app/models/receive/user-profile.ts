export interface PublicUserProfile {
  id: number;
  nick: string;
  email?: string;
  location: string;
  birthday: string;
  avatar: string | null;
  public_role: PublicRole;
  created_at: string;
  last_seen: string;
  can_pm: boolean;
  is_verified: boolean;
  last_post?: LastPost;
}
interface PublicRole {
  name: string;
  description?: string;
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