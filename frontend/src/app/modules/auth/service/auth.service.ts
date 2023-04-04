import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, concatMap, map } from 'rxjs';
import { Subject } from 'rxjs';
import { Global } from 'src/app/environment/global';
import { AuthData } from 'src/app/models/auth-data';
import { Register } from 'src/app/models/register';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { ResetPassword } from 'src/app/models/reset-password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL: string;
  private apiURL: string;

  private userSubject: BehaviorSubject<any>;
  public authData: Observable<{
    userData: User;
    userPreferences: UserPreferences;
  } | null>;
  public isAuth: boolean;

  constructor(private http: HttpClient) {
    this.baseURL = Global.url;
    this.apiURL = Global.api;

    this.userSubject = new BehaviorSubject(null);
    this.authData = this.userSubject.asObservable();
    this.isAuth = false;
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
    return this.http.post(`${this.apiURL}auth/login`, params).pipe(
      concatMap((r) => {
          return this.checkLogin().pipe(
            map((checkR) => {
              // console.log('R', r);
              // console.log('checkR', checkR);
              return r;
            }),
          );
      })
    );
  }

  login2(authData: AuthData): Observable<any> {
    let params = JSON.stringify(authData);
    return this.http.post(`${this.apiURL}auth/login`, params)
  }

  checkLogin(): Observable<any> {
    return this.http.get(`${this.apiURL}auth/data`).pipe(
      map((r) => {
        this.userSubject.next(r);
        this.isAuth = true;
        return r;
      })
    );
  }

  autoAuthUser() {
    this.checkLogin().subscribe({
      next: (r) => {
        return;
      },
      error: (e) => {
        return;
      },
    });
  }

  public get user() {
    return this.userSubject.value;
  }

  resetPassword(resetPassowrdData: ResetPassword): Observable<any> {
    let params = JSON.stringify(resetPassowrdData);
    return this.http.post(`${this.apiURL}auth/reset-password`, params);
  }

  logout(): Observable<any> {
    this.userSubject.next(null);
    this.isAuth = false;
    return this.http.get(`${this.apiURL}auth/logout`);
  }
}
