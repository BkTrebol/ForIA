import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../environment/global';
import { Category } from '../../../models/category';
import { Topic } from '../../../models/topic';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiCategoryURL: string;

  constructor(private http: HttpClient) {
    this.apiCategoryURL = Global.api + 'category/';
  }

  //TODO add types
  allCategories(): Observable<any> {
    return this.http.get(`${this.apiCategoryURL}`);
  }

  category(id: string): Observable<any> {
    return this.http.get(`${this.apiCategoryURL}${id}`);
  }

  topics(id: string): Observable<any> {
    return this.http.get(`${this.apiCategoryURL}${id}`);
  }
}
