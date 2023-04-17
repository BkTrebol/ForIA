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