export interface UserCard {
  id: number;
  nick: string;
  avatar: string | null;
  public_role: PublicRol;
  // public_role_id:number;
  created_at: string;
}

interface PublicRol{
  name:string;
  description?:string;
}
