import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Forum } from 'src/app/models/receive/list-category';
import { ListTopics } from 'src/app/models/receive/list-topics';
import { Topic } from 'src/app/models/send/create-topic';
import { EditTopic } from 'src/app/models/receive/edit-topic';
import { OneTopic } from 'src/app/models/receive/edit-topic';
import { MessageRes } from 'src/app/models/common/message-res';
import { ListSimple } from 'src/app/models/receive/list-simple';
import { Role } from 'src/app/models/receive/admin-role';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiCategoryURL: string;
  private apiTopicURL: string;

  constructor(private http: HttpClient) {
    this.apiCategoryURL = environment.api + 'category/';
    this.apiTopicURL = environment.api + 'topic/';
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
      const { poll, ...newTopic } = topic;
      params = JSON.stringify(newTopic);
    } else {
      params = JSON.stringify(topic);
    }
    return this.http.post(`${this.apiTopicURL}`, params);
  }

  oneTopic(id: string): Observable<EditTopic> {
    return this.http.get<EditTopic>(`${this.apiTopicURL}one-topic/${id}`);
  }

  allCateogry(): Observable<ListSimple> {
    return this.http.get<ListSimple>(`${this.apiCategoryURL}all-category/`);
  }

  editTopic(id: string, topic: OneTopic): Observable<MessageRes> {
    const params = JSON.stringify(topic);
    return this.http.put<MessageRes>(`${this.apiTopicURL}${id}`, params);
  }

  getRoles(categoryId:number):Observable<Role[]>{
    return this.http.get<Role[]>(`${this.apiTopicURL}roles/${categoryId}`)
  }
}
