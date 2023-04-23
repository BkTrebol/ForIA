import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../environment/global';
import { ListPosts, Poll } from 'src/app/models/receive/list-posts';
import { Poll as SendPoll} from 'src/app/models/send/create-topic';
import { CreatePost } from 'src/app/models/send/create-post';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private apiTopicURL: string;
  private apiPostURL: string;

  constructor(private http: HttpClient) {
    this.apiTopicURL = Global.api + 'topic/';
    this.apiPostURL = Global.api + 'post/';
  }

  posts(id: string, page: string): Observable<ListPosts> {
    return this.http.get<ListPosts>(`${this.apiTopicURL}${id}?page=${page}`);
  }

  createPost(post: CreatePost): Observable<any> {
    let params = JSON.stringify(post);
    return this.http.post(`${this.apiPostURL}`, params);
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.apiPostURL}${id}`);
  }

  getPollVotes(id: number): Observable<Poll>{
    return this.http.get<Poll>(`${Global.api}poll/${id}`);
  }

  vote(id:Number):Observable<any> {
    return this.http.put<any>(`${Global.api}poll/vote/${id}`,null)
  }

  getPollData(topicId: number): Observable<{title:string,poll:SendPoll}>{
    return this.http.get<{title:string,poll:SendPoll}>(`${Global.api}poll/edit/${topicId}`)
  }

  poll(topicId: number,poll:SendPoll): Observable<any>{
    return this.http.post<any>(`${Global.api}poll/create/${topicId}`,poll)
  }
}
