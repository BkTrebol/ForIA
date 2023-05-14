export interface ForumStats {
  topics: number;
  posts: number;
  users: number;
  lastUser: LastUser;
  lastPoll?: LastPoll;
}

interface LastUser {
  id: number;
  nick: string;
}

interface LastPoll {
  id: number;
  name: string;
  topic_id: number;
}