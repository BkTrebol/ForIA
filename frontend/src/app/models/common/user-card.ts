export interface UserCard {
  id: number;
  nick: string;
  avatar: string | null;
  public_role: PublicRol;
  created_at: string;
}

interface PublicRol {
  name: string;
  description?: string;
}
