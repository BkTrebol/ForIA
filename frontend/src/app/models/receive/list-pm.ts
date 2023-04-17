import { Post, Topic } from "./list-posts";

export interface ListPm{
    messages: Array<ShortPrivateMessage>,
    current_page:number,
    last_page:number,
    total:number,
}

interface ShortPrivateMessage{
    id:number,
    title:string,
    description:string,
    created_at: Date,
    to:{id:number,nick:string}
    user:{id:number,nick:string}
}

export interface PrivateMessage {
    id:string,
    title:string,
    description:string,
    posts:Array<Post>,
    topic:Topic,
    current_page:number,
    last_page:number,
    total:number
}

export interface newPrivateMessage {
    recipient:number,
    title:string,
    content:string,
}

export interface replyToPrivateMessage{
    topic_id:number,
    content:string,
}