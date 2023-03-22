import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthData } from '../../models/auth-data';
import { Register } from '../../models/register';
import { Global } from '../global';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL: string = Global.url;
  private apiURL: string = Global.api;

  constructor(private http: HttpClient, public router: Router) {}

  getCSRF(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  }

  register(register: Register): Observable<any> {
    let params = JSON.stringify(register);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiURL}auth/register`, params, {
      headers: headers,
      withCredentials: true,
    });
  }

  login(authData: AuthData): Observable<any> {
    let params = JSON.stringify(authData);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiURL}auth/login`, params, {
      headers: headers,
      withCredentials: true,
    });
  }

  profile(): Observable<any> {
    return this.http.get(`${this.apiURL}auth/data`, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiURL}auth/logout`, {
      withCredentials: true,
    });
  }
}
