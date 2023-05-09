export interface Topic {
  category_id: number;
  title: string;
  description: string;
  content: string;
  poll: Poll;
}

export interface Poll {
  name: string;
  finish_date?: string;
  options: Array<PollOption>;
}

interface PollOption {
  option: string;
  poll_id?: number;
}
