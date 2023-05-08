import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/environment/global';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string;
  constructor(
    private _http: HttpClient,
  ) { 
    this.apiUrl = Global.api+'admin/';
  }

  getList(filters:any):Observable<any> {
    return this._http.get(`${this.apiUrl}user/list${filters}`);
  }

  getRoles():Observable<any> {
    return this._http.get(`${this.apiUrl}role/all`);
  }

}
