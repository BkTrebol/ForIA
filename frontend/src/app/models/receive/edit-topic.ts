export interface EditTopic {
  topic: OneTopic;
  category: {
    title: string;
  };
}

export interface OneTopic {
  category_id: number;
  title: string;
  description: string;
  content: string;
}