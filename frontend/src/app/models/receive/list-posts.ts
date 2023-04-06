export interface ListPosts {
    can_edit: boolean;
    can_post: boolean;
    category: Category;
    topic: Topic;
    posts: Post[];
}

export interface Category {
  id: number;
  title: string;
  // maybe section
}

export interface Topic {
  id: number;
  title: string;
  created_at: string; //un dels dos
  updated_at: string;
  content: string | null;
  user: User;
}

interface User {
  id: number;
  nick: string;
//   email: string; //no
//   location: string | null; //no
//   birthday: string | null; //no
  avatar: string | null;
  roles: string[];
//   created_at: string; //no
//   updated_at: string; //no
}

export interface Post {
  id: number;
  content: string;
  created_at: string; //nomes un
  updated_at: string;
  can_edit: boolean;
  user: User;
}