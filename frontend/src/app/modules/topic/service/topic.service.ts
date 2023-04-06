import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../environment/global';
import { ListPosts } from 'src/app/models/receive/list-posts';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private apiTopicURL: string;

  constructor(private http: HttpClient) {
    this.apiTopicURL = Global.api + 'topic/';
  }

  posts(id: string): Observable<ListPosts> {
    return this.http.get<ListPosts>(`${this.apiTopicURL}${id}`);
  }
}
