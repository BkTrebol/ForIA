import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/environment/global';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl: string;
  private catUrl: string;

  constructor(private _http: HttpClient) {
    this.apiUrl = Global.api + 'admin/';
    this.catUrl = this.apiUrl + 'category/';
  }

  getCategories(): Observable<any> {
    return this._http.get<any>(`${this.catUrl}list`);
  }

  saveCategory(form: FormData): Observable<any> {
    return this._http.post<any>(`${this.catUrl}save`, form);
  }

  saveCategories(categories: Array<any>): Observable<any> {
    const params = JSON.stringify({ categories: categories });
    return this._http.post<any>(`${this.catUrl}update`, params);
  }

  getRoles(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}role/all`);
  }
}
