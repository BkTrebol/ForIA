export interface EditPost {
  post: Post;
  topic: Topic;
}

interface Post {
  topic_id: number;
  content: string;
}

interface Topic {
  title: string;
}