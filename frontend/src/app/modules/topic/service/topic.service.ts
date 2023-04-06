import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../environment/global';
import { Topic } from '../../../models/topic';
import { Category } from '../../../models/category';
import { Post } from '../../../models/post';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private apiTopicURL: string;

  constructor(private http: HttpClient) {
    this.apiTopicURL = Global.api + 'topic/';
  }

  //TODO add types
  posts(id: string): Observable<any> {
    return this.http.get(`${this.apiTopicURL}${id}`);
  }
}
