export interface EditPost {
  post: {
    topic_id: number,
    content: string
  },
  topic: {
    title: string
  }
}