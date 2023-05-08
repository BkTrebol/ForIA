import { UserCard } from '../common/user-card';

export type Forum = Section[];
export interface Section {
  categories: Category[];
  name: string;
}

export interface Category {
  id: number;
  title: string;
  description: string;
  image: null | string;
  topics: number,
  posts: number,
  lastPost: {
    created_at: string;
    topic: {
      id: number;
      title: string;
    };
    user: UserCard;
  };
}