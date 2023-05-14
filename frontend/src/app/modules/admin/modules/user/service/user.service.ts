import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string;

  constructor(
    private _http: HttpClient,
  ) { 
    this.apiUrl = environment.api+'admin/';
  }

  getList(filters:any):Observable<any> {
    return this._http.get(`${this.apiUrl}user/list${filters}`);
  }

  saveOrder(roles:any[]):Observable<any> {
    const body = JSON.stringify({roles:roles});
    return this._http.put(`${this.apiUrl}role/save`,body);
  }

  getAllRoles():Observable<any> {
    return this._http.get(`${this.apiUrl}role/all/true`);
  }

  getRoles():Observable<any> {
    return this._http.get(`${this.apiUrl}role/normal`);
  }
  
  getPublicRoles():Observable<any> {
    return this._http.get(`${this.apiUrl}role/public`);
  }

  getUser(id:number):Observable<any> {
    return this._http.get(`${this.apiUrl}user/${id}`);
  }

  updateUser(user:any):Observable<any> {
    return this._http.put(`${this.apiUrl}user/update`,user);
  }

  dropUser(id:number):Observable<any> {
    return this._http.delete(`${this.apiUrl}user/${id}`);
  }

  checkNick(nick:string,oldNick:string):Observable<any> {
    const body = JSON.stringify({nick:nick, oldNick:oldNick});
    return this._http.post(`${this.apiUrl}user/check/nick`, body);
  }

  checkEmail(email:string,oldEmail:string):Observable<any> {
    const body = JSON.stringify({email:email, oldEmail:oldEmail});
    return this._http.post(`${this.apiUrl}user/check/email`,body);
  }

  deleteRole(role:number,type:string):Observable<any> {
    return this._http.delete(`${this.apiUrl}role/${type.toLowerCase()}/${role}`);
  }

  editRole(role:any,type:string):Observable<any>{
    return this._http.put(`${this.apiUrl}role/${type.toLowerCase()}`,role)
  }

  saveRole(role:any,type:string):Observable<any>{
    return this._http.post(`${this.apiUrl}role/${type.toLowerCase()}`,role)
  }
}
