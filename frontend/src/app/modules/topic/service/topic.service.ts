import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListPosts, Poll } from 'src/app/models/receive/list-posts';
import { Poll as SendPoll} from 'src/app/models/send/create-topic';
import { CreatePost } from 'src/app/models/send/create-post';
import { MessageRes } from 'src/app/models/common/message-res';
import { PollData } from 'src/app/models/receive/poll-data';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private apiTopicURL: string;
  private apiPostURL: string;
  private apiPollURL: string;

  constructor(private http: HttpClient) {
    this.apiTopicURL = environment.api + 'topic/';
    this.apiPostURL = environment.api + 'post/';
    this.apiPollURL = environment.api + 'poll/';
  }

  posts(id: string, page: string): Observable<ListPosts> {
    return this.http.get<ListPosts>(`${this.apiTopicURL}${id}?page=${page}`);
  }

  createPost(post: CreatePost): Observable<any> {
    let params = JSON.stringify(post);
    return this.http.post<void>(`${this.apiPostURL}`, params);
  }

  deletePost(id: string): Observable<MessageRes> {
    return this.http.delete<MessageRes>(`${this.apiPostURL}${id}`);
  }

  deleteTopic(id: string): Observable<MessageRes> {
    return this.http.delete<MessageRes>(`${this.apiTopicURL}${id}`);
  }

  getPollVotes(id: number): Observable<Poll> {
    return this.http.get<Poll>(`${this.apiPollURL}${id}`);
  }

  vote(id: Number): Observable<MessageRes> {
    return this.http.put<MessageRes>(`${this.apiPollURL}vote/${id}`, null);
  }

  getPollData(topicId: number): Observable<PollData> {
    return this.http.get<PollData>(
      `${this.apiPollURL}edit/${topicId}`
    );
  }

  poll(topicId: number, poll: SendPoll): Observable<any> {
    return this.http.post<any>(`${this.apiPollURL}create/${topicId}`, poll);
  }

  closePoll(id: string): Observable<MessageRes> {
    return this.http.get<MessageRes>(`${this.apiPollURL}close/${id}`);
  }

  deletePoll(id: string): Observable<MessageRes> {
    return this.http.delete<MessageRes>(`${this.apiPollURL}delete/${id}`);
  }

  toggleTopic(id:number):Observable<MessageRes>{
    return this.http.get<MessageRes>(`${this.apiTopicURL}toggle/${id}`)
  }


}
