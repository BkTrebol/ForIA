export interface ListTopic {
  category: Category;
  topics: Topic[];
  total: number;
  current_page: number;
  last_page: number;
}

export interface Category {
  id: number;
  title: string;
  can_post: boolean;
}

export interface Topic {
  id: number;
  user: User;
  title: string;
  description: string;
  created_at: string;
}

interface User {
  id: number;
  nick: string;
  avatar: string | null;
}