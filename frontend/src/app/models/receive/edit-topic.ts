export interface EditTopic {
  topic: OneTopic;
  category: Category;
}

export interface OneTopic {
  category_id: number;
  title: string;
  description: string;
  content: string;
}

interface Category {
  title: string;
}