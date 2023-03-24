import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from '../../models/auth-data';
import { Register } from '../../models/register';
import { Global } from '../global';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL: string;
  private apiURL: string;
  private headers: HttpHeaders;

  private isAuthenticated: boolean;
  private authStatusListener: Subject<boolean>;

  private subscribe$: Subscription;

  constructor(private http: HttpClient, public router: Router) {
    this.baseURL = Global.url;
    this.apiURL = Global.api;
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    this.isAuthenticated = false;
    this.authStatusListener = new Subject<boolean>();
    this.subscribe$ = new Subscription();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getCSRF(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/sanctum/csrf-cookie`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  register(register: Register): Observable<any> {
    let params = JSON.stringify(register);
    return this.http.post(`${this.apiURL}auth/register`, params, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  login(authData: AuthData): Observable<any> {
    let params = JSON.stringify(authData);
    return this.http.post(`${this.apiURL}auth/login`, params);
  }

  logout(): Observable<any> {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    return this.http.get(`${this.apiURL}auth/logout`, {
      headers: this.headers,
      withCredentials: true,
    });
  }

  autoAuthUser() {
    this.subscribe$ = this.http
      .get(`${this.apiURL}auth/data`, {
        headers: this.headers,
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
        },
        error: (err) => {
          this.isAuthenticated = false;
          this.authStatusListener.next(false);
        },
      });
  }

  unsubscribeAutoAuthUser() {
    this.subscribe$.unsubscribe();
  }

  getAuthData(): Observable<any> {
    return this.http.get(`${this.apiURL}auth/data`, {
      headers: this.headers,
      withCredentials: true,
    });
  }
}
