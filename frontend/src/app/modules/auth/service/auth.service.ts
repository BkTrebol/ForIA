import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, concatMap, map, } from 'rxjs';
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
  private apiAuthURL: string;
  public loading$ : Subject<boolean>

  private userSubject: BehaviorSubject<any>;
  public authData: Observable<{
    userData: User;
    userPreferences: UserPreferences;
  } | null>;

  constructor(private http: HttpClient) {
    this.baseURL = Global.url;
    this.apiAuthURL = Global.api + 'auth/';

    this.userSubject = new BehaviorSubject(null);
    this.authData = this.userSubject.asObservable();

    this.loading$ = new Subject(); //
  }

  completeLoad(){
    this.loading$.complete();
  }

  // ADMIN
  getUserList(): Observable<any> {
    return this.http.get<any>(`${Global.api}user/publiclist/`);
  }

  // ADMIN
  changeUser(user: number): Observable<{message: string}> {
    return this.http.get<{ message: string }>(
      `${this.apiAuthURL}adminlogin/${user}`
    );
  }

  getCSRF(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/sanctum/csrf-cookie`);
  }

  register(register: Register): Observable<any> {
    let params = JSON.stringify(register);
    return this.http.post(`${this.apiAuthURL}register`, params).pipe(
      concatMap((r) => {
        return this.checkLogin().pipe(
          map((checkR) => {
            return r;
          })
        );
      })
    );
  }

  login(authData: AuthData): Observable<any> {
    let params = JSON.stringify(authData);
    return this.http.post(`${this.apiAuthURL}login`, params).pipe(
      concatMap((r) => {
        return this.checkLogin().pipe(
          map((checkR) => {
            return r;
          })
        );
      })
    );
  }

  checkLogin(): Observable<any> {
    return this.http.get(`${this.apiAuthURL}data`).pipe(
      map((r) => {
        this.userSubject.next(r);
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

  isLogged(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiAuthURL}check-login`);
  }

  public get user() {
    return this.userSubject.value;
  }

  resetPassword(resetPassowrdData: ResetPassword): Observable<any> {
    let params = JSON.stringify(resetPassowrdData);
    return this.http.post(`${this.apiAuthURL}reset-password`, params);
  }

  logout(): Observable<{ message: string }> {
    this.userSubject.next(null);
    return this.http.get<{ message: string }>(`${this.apiAuthURL}logout`);
  }
}
