import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, concatMap, map } from 'rxjs';
import { Global } from 'src/environment/global';
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
  private apiAdminURL: string;
  public isAdmin: BehaviorSubject<any>;
  public $isAdmin: Observable<boolean | null>;
  public loading$: Subject<boolean>;
  public verification?: {
    id: string,
    hash: string,
    expires: string,
    signature: string,
  }

  private userSubject: BehaviorSubject<any>;
  public authData: Observable<{
    userData: User;
    userPreferences: UserPreferences;
  } | null>;

  constructor(private http: HttpClient) {
    this.baseURL = Global.url;
    this.apiAuthURL = Global.api + 'auth/';
    this.apiAdminURL = Global.api+'admin/';
    this.isAdmin = new BehaviorSubject(null);
    this.$isAdmin = this.isAdmin.asObservable();
    this.userSubject = new BehaviorSubject(null);
    this.authData = this.userSubject.asObservable();

    this.loading$ = new Subject();
  }

  completeLoad() {
    this.loading$.complete();
  }

  // ADMIN
  getUserList(): Observable<any> {
    return this.http.get<any>(`${Global.api}user/publiclist/`);
  }

  // ADMIN
  changeUser(user: number): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(
      `${this.apiAuthURL}adminlogin/${user}`
    );
  }

  sendVerification(){
    return this.http.get(`${this.apiAuthURL}resendVerification`)
  }
  verifyEmail(verification:any){
    return this.http.get(`${this.apiAuthURL}verify/${verification.id}/${verification.hash}?expires=${verification.expires}&signature=${verification.signature}`);
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

  login(authData: AuthData, google: boolean = false): Observable<any> {
    let params = JSON.stringify(authData);
    return this.http
      .post(`${this.apiAuthURL}${google ? 'googleconfirm' : 'login'}`, params)
      .pipe(
        concatMap((r) => {
          return this.checkLogin().pipe(
            map((checkR) => {
              return r;
            })
          );
        })
      );
  }

  adminLogin(authData: AuthData): Observable<any> {
    let params = JSON.stringify(authData);
    return this.http
      .post(`${this.apiAdminURL}login`, params)
      .pipe(
        concatMap((r) => {
          return this.checkLogin().pipe(
            map((checkR) => {
              return r;
            })
          );
        })
      );
  }

  checkAdmin(): Observable<any> {
    return this.http.get(`${this.apiAdminURL}check`)
    .pipe(map((r) => {
      if(r){
        this.isAdmin.next(true);
      } else{
        this.isAdmin.next(false);
      }
      return r;
    }))
  }

  checkLogin(): Observable<any> {
    return this.http.get(`${this.apiAuthURL}data`,).pipe(
      map((r) => {
        this.userSubject.next(r);
        return r;
      })
    );
  }

  autoAuthUser() {
    this.checkLogin().subscribe({
      next: (r) => {
        this.loading$.complete();
        return;
      },
      error: (e) => {
        this.loading$.complete();
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
    this.isAdmin.next(null);
    return this.http.get<{ message: string }>(`${this.apiAuthURL}logout`);
  }
}
