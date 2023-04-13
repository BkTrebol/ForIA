// export interface ListCategory {
//   categories: Section //change to array of section
// }

// export interface Section {
//   [key: string]: Category[];
// }

// export interface Category {
//   id: number;
//   title: string;
//   section: string;
//   description: string;
//   image: string | null;
//   music: string | null;
//   can_post: string; //to boolena
//   created_at: string;
//   updated_at: string;
//   last_post: Post;
// }

// export interface Post {
//   id: number;
//   topic_id: number;
//   //title
//   user_id: number; //passar User amb (id, nick, avatar)
//   content: string;
//   created_at: string; //nomes passar un o l'altre (created o updated)
// }

export type Forum = Section[];
export interface Section {
  categories: Category[];
  name: string;
}

export interface Category {
  id: number;
  title: string;
  lastPost: {
    created_at: string;
    topic: {
      id: number;
      title: string;
    };
    user: {
      id: number;
      nick: string;
      avatar: null | string;
    };
  };
  description: string;
  image: null | string;
  can_post: boolean;
}