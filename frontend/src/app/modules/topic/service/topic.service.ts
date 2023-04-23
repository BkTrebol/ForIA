import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../environment/global';
import { ListPosts, Poll } from 'src/app/models/receive/list-posts';
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

  createPost(post: CreatePost): Observable<void> {
    let params = JSON.stringify(post);
    return this.http.post<void>(`${this.apiPostURL}`, params);
  }

  deletePost(id: string): Observable<{message: string}> {
    return this.http.delete<{ message: string }>(`${this.apiPostURL}${id}`);
  }

  getPollVotes(id: number): Observable<Poll>{
    return this.http.get<Poll>(`${Global.api}poll/${id}`);
  }

  vote(id:Number):Observable<any> {
    return this.http.put<any>(`${Global.api}poll/vote/${id}`,null)
  }
}
