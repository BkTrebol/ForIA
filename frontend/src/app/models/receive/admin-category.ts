export interface Section {
  name: string;
  categories: Category[];
}

export interface Category {
  id: number;
  order: number;
  title: string;
  section: string;
  description: string;
  image?: string;
  music?: string;
  can_view: number;
  can_post: number;
  can_mod: number;
  created_at: Date;
  updated_at: Date;
}
