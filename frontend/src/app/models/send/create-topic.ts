export interface Topic {
  category_id: number;
  title: string;
  description: string;
  content: string;
  poll: Poll;
  can_view:number;
  can_post:number;
}

export interface Poll {
  name: string;
  finish_date?: string;
  options: PollOption[];
}

interface PollOption {
  option: string;
  poll_id?: number;
}
