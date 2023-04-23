export interface Topic {
  category_id: number;
  title: string;
  description: string;
  content: string;
  poll: Poll;
}

export interface Poll {
  name: string;
  finish_date?: Date;
  options: Array<string>;
}

interface PollOption {
  option: string;
  poll_id?: number;
}
