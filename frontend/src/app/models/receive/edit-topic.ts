export interface EditTopic {
  topic: OneTopic;
  category: Category;
}

export interface OneTopic {
  category_id: number;
  title: string;
  description: string;
  content: string;
  is_admin:boolean;
  is_mod:boolean;
  can_view:number;
  can_post:number;
}

interface Category {
  title: string;
}