import { UserCard } from '../common/user-card';

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
  user: UserCard;
}

export interface Post {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  can_edit: boolean;
  user: UserCard;
}
