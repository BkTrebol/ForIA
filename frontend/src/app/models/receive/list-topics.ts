export interface ListTopic {
  category: Category;
  topics: Topic[];
}

export interface Category {
  id: number;
  title: string;
  // maybe section
  can_post: boolean; //canviar per can_edit o can_mod
}

export interface Topic {
  id: number;
  user_id: number; //Passar User (amb id, nick, avatar)
  title: string;
  description: string;
  created_at: string;
  //afegir can_edit
}