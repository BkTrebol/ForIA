import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../../environment/global';
import { Forum } from 'src/app/models/receive/list-category';
import { ListTopics } from 'src/app/models/receive/list-topics';
import { Topic } from 'src/app/models/send/create-topic';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiCategoryURL: string;

  constructor(private http: HttpClient) {
    this.apiCategoryURL = Global.api + 'category/';
  }

  categories(): Observable<Forum> {
    return this.http.get<Forum>(`${this.apiCategoryURL}`);
  }

  topics(id: string, page: string): Observable<ListTopics> {
    return this.http.get<ListTopics>(
      `${this.apiCategoryURL}${id}?page=${page}`
    );
  }

  post(topic: Topic): Observable<any> {
    let params: string;
    if (topic.poll.options.length === 0) {
      let { poll, ...newTopic } = topic
      params = JSON.stringify(newTopic);
    } else {
      params = JSON.stringify(topic);
    }
    return this.http.post(`${Global.api}topic`, params);
  }
}
