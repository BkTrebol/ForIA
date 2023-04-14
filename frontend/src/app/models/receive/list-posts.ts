export interface ListPosts {
  can_edit: boolean;
  can_post: boolean;
  category: Category;
  topic: Topic;
  posts: Post[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface Category {
  id: number;
  title: string;
}

export interface Topic {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  content: string | null;
  user: User;
}

interface User {
  id: number;
  nick: string;
  avatar: string | null;
  rol: string;
  created_at: string;
}

export interface Post {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  can_edit: boolean;
  user: User;
}
