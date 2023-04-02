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
  private apiCategoryURL: string;

  constructor(private http: HttpClient) {
    this.apiTopicURL = Global.api + 'topic/';
    this.apiCategoryURL = Global.api + 'category/';
  }

  //TODO add types
  category(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiCategoryURL}detail/${id}`);
  }

  topic(id: string): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiTopicURL}detail/${id}`);
  }

  posts(id: string): Observable<any> {
    return this.http.get(`${this.apiTopicURL}${id}`);
  }
}
