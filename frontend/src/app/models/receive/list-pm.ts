import { Post, Topic } from './list-posts';

export interface ListPm {
  messages: Array<ShortPrivateMessage>;
  current_page: number;
  last_page: number;
  total: number;
}

interface ShortPrivateMessage {
  id: number;
  title: string;
  created_at: Date;
  receiver?: { id: number; nick: string };
  sender?: { id: number; nick: string };
}

export interface PrivateMessageList{
  message: PrivateMessage;
  thread: Array<PrivateMessage>;
  recipient:number;
  current_page: number;
  last_page: number;
  total: number;
}

export interface PrivateMessage {
  id: string;
  title: string;
  content:string;
  sender_id: number;
  receiver_id: number;
  sender:{id:number,nick:string,avatar:string}
  thread_id:number;
}

export interface newPrivateMessage {
  recipient?: number;
  title: string;
  content: string;
  thread_id?:number;
}

