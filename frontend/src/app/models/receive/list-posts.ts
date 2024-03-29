import { UserCard } from '../common/user-card';
import { Pages } from '../common/pages';

export interface ListPosts {
  closed: boolean;
  can_mod: boolean;
  can_edit: boolean;
  can_post: boolean;
  can_poll: boolean;
  category: Category;
  topic: Topic;
  posts: Post[];
  poll: Poll;
  page: Pages;
}
export interface Poll {
  can_vote: boolean;
  can_edit?: boolean;
  can_close?: boolean;
  finish_date: string;
  id: number;
  name: string;
  votes: number;
  options: PollOption[];
}

interface PollOption {
  voted?: boolean;
  votes?: number;
  id: number;
  option: string;
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
