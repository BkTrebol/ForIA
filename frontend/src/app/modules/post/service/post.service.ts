import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetCreatePost, CreatePost } from 'src/app/models/send/create-post';
import { EditPost } from 'src/app/models/receive/edit-post';
import { Global } from 'src/environment/global';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiPostURL: string;

  constructor(private http: HttpClient) {
    this.apiPostURL = Global.api + 'post/';
  }

  post(post: GetCreatePost): Observable<void> {
    let params = JSON.stringify(post);
    return this.http.post<void>(`${this.apiPostURL}`, params);
  }

  onePost(id: string): Observable<EditPost> {
    return this.http.get<EditPost>(`${this.apiPostURL}one-post/${id}`);
  }

  editPost(id: string, post: CreatePost): Observable<{ message: string }> {
    let params = JSON.stringify(post);
    return this.http.put<{ message: string }>(
      `${this.apiPostURL}${id}`,
      params
    );
  }

  oneTopic(id: string): Observable<{ title: string }> {
    return this.http.get<{ title: string }>(
      `${this.apiPostURL}one-topic/${id}`
    );
  }

  allTopic(): Observable<{ id: number; title: string }[]> {
    return this.http.get<{ id: number; title: string }[]>(
      `${this.apiPostURL}all-topic/`
    );
  }
}
