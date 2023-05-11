import { Pages } from '../common/pages';

export interface ListPm {
  messages: ShortPrivateMessage[];
  page: Pages;
}

interface ShortPrivateMessage {
  id: number;
  title: string;
  created_at: string;
  viewed?: boolean;
  receiver?: MiniUser;
  sender?: MiniUser;
}

export interface PrivateMessageList {
  message: PrivateMessage;
  thread: PrivateMessage[];
  recipient: number;
  page: Pages;
}

export interface PrivateMessage {
  id: string;
  title: string;
  content: string;
  sender_id: number;
  receiver_id: number;
  sender: User;
  thread_id: number;
}

export interface newPrivateMessage {
  recipient?: number;
  title: string;
  content: string;
  thread_id?: number;
}

interface MiniUser {
  id: number;
  nick: string;
}

interface User {
  id: number;
  nick: string;
  avatar: string | null;
}