import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetCreatePost, CreatePost } from 'src/app/models/send/create-post';
import { EditPost } from 'src/app/models/receive/edit-post';
import { environment } from 'src/environments/environment';
import { MessageRes } from 'src/app/models/common/message-res';
import { ListSimple, TopicTitle } from 'src/app/models/receive/list-simple';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiPostURL: string;

  constructor(private http: HttpClient) {
    this.apiPostURL = environment.api + 'post/';
  }

  post(post: GetCreatePost): Observable<any> {
    const params = JSON.stringify(post);
    return this.http.post<void>(`${this.apiPostURL}`, params);
  }

  onePost(id: string): Observable<EditPost> {
    return this.http.get<EditPost>(`${this.apiPostURL}one-post/${id}`);
  }

  editPost(id: string, post: CreatePost): Observable<MessageRes> {
    const params = JSON.stringify(post);
    return this.http.put<MessageRes>(`${this.apiPostURL}${id}`, params);
  }

  oneTopic(id: string): Observable<TopicTitle> {
    return this.http.get<TopicTitle>(`${this.apiPostURL}one-topic/${id}`);
  }

  allTopic(): Observable<ListSimple> {
    return this.http.get<ListSimple>(`${this.apiPostURL}all-topic/`);
  }
}
