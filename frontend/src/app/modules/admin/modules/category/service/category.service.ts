import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/environment/global';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl: string;
  constructor(
    private _http: HttpClient,
  ) { 
    this.apiUrl = Global.api+'admin/';
  }


  getCategories(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}category/list`);
  }

  saveCategories(categories:Array<any>):Observable<any> {
    const params = JSON.stringify({categories:categories})
    console.log(params);
    return this._http.post<any>(`${this.apiUrl}category/update`,params);
  }

  getRoles(): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}role`);
  }

}
