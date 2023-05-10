export interface User {
  id: number;
  nick: string;
  email: string;
  location: string;
  birthday: string;
  avatar: string;
  roles: Array<string>;
  public_role: PublicRole;
  created_at: string;
  updated_at: string;
  isAdmin: boolean;
  isVerified: boolean;
}

interface PublicRole{
  name:string;
  description?:string;
}
