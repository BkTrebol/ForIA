import { UserCard } from '../common/user-card';
import { Pages } from '../common/pages';

export interface ListTopics {
  category: Category;
  topics: Topic[];
  page: Pages;
}

export interface Category {
  id: number;
  title: string;
  can_post: boolean;
}

export interface Topic {
  id: number;
  user: UserCard;
  title: string;
  description: string;
  created_at: string;
  last_page: number;
  posts: number;
  last_post: {
    id: number;
    created_at: string;
    user: UserCard;
  };
}
