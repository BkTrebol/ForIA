import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../../environment/global';
import { ListPosts, Poll } from 'src/app/models/receive/list-posts';
import { Poll as SendPoll} from 'src/app/models/send/create-topic';
import { CreatePost } from 'src/app/models/send/create-post';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private apiTopicURL: string;
  private apiPostURL: string;
  private apiPollURL: string;

  constructor(private http: HttpClient) {
    this.apiTopicURL = Global.api + 'topic/';
    this.apiPostURL = Global.api + 'post/';
    this.apiPollURL = Global.api + 'poll/';
  }

  posts(id: string, page: string): Observable<ListPosts> {
    return this.http.get<ListPosts>(`${this.apiTopicURL}${id}?page=${page}`);
  }

  createPost(post: CreatePost): Observable<void> {
    let params = JSON.stringify(post);
    return this.http.post<void>(`${this.apiPostURL}`, params);
  }

  deletePost(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiPostURL}${id}`);
  }

  deleteTopic(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiTopicURL}${id}`);
  }

  getPollVotes(id: number): Observable<Poll> {
    return this.http.get<Poll>(`${this.apiPollURL}${id}`);
  }

  vote(id: Number): Observable<any> {
    return this.http.put<any>(`${this.apiPollURL}vote/${id}`, null);
  }

  getPollData(topicId: number): Observable<{ title: string; poll: SendPoll }> {
    return this.http.get<{ title: string; poll: SendPoll }>(
      `${this.apiPollURL}edit/${topicId}`
    );
  }

  poll(topicId: number, poll: SendPoll): Observable<any> {
    return this.http.post<any>(`${this.apiPollURL}create/${topicId}`, poll);
  }

  closePoll(id: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiPollURL}close/${id}`);
  }

  deletePoll(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiPollURL}delete/${id}`
    );
  }
}
