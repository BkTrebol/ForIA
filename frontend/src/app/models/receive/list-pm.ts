import { Post, Topic } from './list-posts';
import { Pages } from '../common/pages';

export interface ListPm {
  messages: Array<ShortPrivateMessage>;
  page: Pages;
}

interface ShortPrivateMessage {
  id: number;
  title: string;
  created_at: Date;
  viewed?: boolean;
  receiver?: { id: number; nick: string };
  sender?: { id: number; nick: string };
}

export interface PrivateMessageList {
  message: PrivateMessage;
  thread: Array<PrivateMessage>;
  recipient: number;
  page: Pages;
}

export interface PrivateMessage {
  id: string;
  title: string;
  content: string;
  sender_id: number;
  receiver_id: number;
  sender: { id: number; nick: string; avatar: string };
  thread_id: number;
}

export interface newPrivateMessage {
  recipient?: number;
  title: string;
  content: string;
  thread_id?: number;
}
