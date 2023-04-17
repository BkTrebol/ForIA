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
  can_post: boolean;
  lastPost: {
    created_at: string;
    topic: {
      id: number;
      title: string;
    };
    user: User;
  };
}

interface User {
  id: number;
  nick: string;
  avatar: null | string;
}