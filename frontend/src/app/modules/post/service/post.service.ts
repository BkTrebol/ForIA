import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePost } from 'src/app/models/send/create-post';
import { Global } from 'src/environment/global';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiPostURL: string;

  constructor(private http: HttpClient) {
    this.apiPostURL = Global.api + 'post/';
  }

  post(post: CreatePost): Observable<void> {
    let params = JSON.stringify(post);
    return this.http.post<void>(`${this.apiPostURL}`, params);
  }

  oneTopic(id: string): Observable<any> {
    return this.http.get(`${this.apiPostURL}one-topic/${id}`);
  }

  allTopic(): Observable<{ id: number; title: string }[]> {
    return this.http.get<{ id: number; title: string }[]>(
      `${this.apiPostURL}all-topic/`
    );
  }
}
