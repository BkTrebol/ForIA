import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../environment/global';
import { Forum } from 'src/app/models/receive/list-category';
import { ListTopics } from 'src/app/models/receive/list-topics';

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
    return this.http.get<ListTopics>(`${this.apiCategoryURL}${id}?page=${page}`);
  }
}
