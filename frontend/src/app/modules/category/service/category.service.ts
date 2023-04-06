import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../environment/global';
import { ListCategory } from 'src/app/models/receive/list-category';
import { ListTopic } from 'src/app/models/receive/list-topics';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiCategoryURL: string;

  constructor(private http: HttpClient) {
    this.apiCategoryURL = Global.api + 'category/';
  }

  categories(): Observable<ListCategory> {
    return this.http.get<ListCategory>(`${this.apiCategoryURL}`);
  }

  topics(id: string): Observable<ListTopic> {
    return this.http.get<ListTopic>(`${this.apiCategoryURL}${id}`);
  }
}
