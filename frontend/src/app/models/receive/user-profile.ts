export interface PublicUserProfile {
  nick: string;
  email: string;
  location: string;
  birthday: string;
  avatar: string | null;
  rol: string;
  created_at: string;
  updated_at: string;
  can_pm: boolean;
}
