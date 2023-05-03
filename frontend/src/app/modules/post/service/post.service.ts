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
}
