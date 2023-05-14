export interface Role {
  id?: number;
  name: string;
  admin: boolean;
  order: number;
}

export interface PublicRole {
  id?: number;
  name: string;
  description: string;
  posts?: number;
}
