import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from '../../models/auth-data';
import { Register } from '../../models/register';
import { Global } from '../global';
import { User } from '../../models/user';
import { UserPreferences } from 'src/app/models/user-preferences';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL: string;
  private apiURL: string;

  private isAuthenticated: boolean;
  private authStatusListener: Subject<boolean>;

  private subscribe$: Subscription;

  public userData: User;
  public userPreferences: {sidebar: boolean, allow_music: boolean};

  constructor(private http: HttpClient, public router: Router) {
    this.baseURL = Global.url;
    this.apiURL = Global.api;
    this.isAuthenticated = false;
    this.authStatusListener = new Subject<boolean>();
    this.subscribe$ = new Subscription();
    this.userData = {
      id: 0,
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
      roles: [],
      created_at: '',
      updated_at: '',
    };
    this.userPreferences = {sidebar: true, allow_music: false};
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getCSRF(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/sanctum/csrf-cookie`);
  }

  register(register: Register): Observable<any> {
    let params = JSON.stringify(register);
    return this.http.post(`${this.apiURL}auth/register`, params);
  }

  login(authData: AuthData): Observable<any> {
    let params = JSON.stringify(authData);
    return this.http.post(`${this.apiURL}auth/login`, params);
  }

  logout(): Observable<any> {
    this.userData = {
      id: 0,
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
      roles: [],
      created_at: '',
      updated_at: '',
    };
    this.userPreferences = { sidebar: true, allow_music: false };
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    return this.http.get(`${this.apiURL}auth/logout`);
  }

  autoAuthUser() {
    this.subscribe$ = this.http.get(`${this.apiURL}auth/data`).subscribe({
      next: (res: any) => {
        this.userData = res['userData'];
        this.userPreferences = res['userPreferences'];
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
    return this.http.get(`${this.apiURL}auth/data`);
  }
}
