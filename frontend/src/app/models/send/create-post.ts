export interface CreatePost {
  topic_id: number;
  content: string;
}

export interface GetCreatePost {
  topic_id: number | undefined;
  content: string;
}
