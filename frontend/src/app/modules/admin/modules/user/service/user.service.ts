import { HttpClient, HttpParams } from '@angular/common/http';
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

  getUser(id:number):Observable<any> {
    return this._http.get(`${this.apiUrl}user/${id}`);
  }

  updateUser(user:any):Observable<any> {
    return this._http.put(`${this.apiUrl}user`,user);
  }

  dropUser(id:number):Observable<any> {
    return this._http.delete(`${this.apiUrl}user/${id}`);
  }

  checkNick(nick:string,oldNick:string):Observable<any> {
    return this._http.get(`${this.apiUrl}user/check/nick/${nick}/${oldNick}`);
  }

  checkEmail(email:string,oldEmail:string):Observable<any> {
    return this._http.get(`${this.apiUrl}user/email/${email}/${oldEmail}`);
  }
}
