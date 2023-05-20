import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl: string;
  private catUrl: string;
  constructor(
    private _http: HttpClient,
  ) {
    this.apiUrl = environment.api+'admin/';
    this.catUrl = this.apiUrl+'category/';
  }

  getCategories(): Observable<any> {
    return this._http.get<any>(`${this.catUrl}list`);
  }

  saveCategory(form: FormData): Observable<any> {
    return this._http.post<any>(`${this.catUrl}save`, form);
  }
  emptyTrash():Observable<any>{
    return this._http.delete(`${this.catUrl}empty`);
  }

  saveCategories(categories: Array<any>): Observable<any> {
    const params = JSON.stringify({ categories: categories });
    return this._http.post<any>(`${this.catUrl}update`, params);
  }

  getRoles(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}role/all`);
  }
}
