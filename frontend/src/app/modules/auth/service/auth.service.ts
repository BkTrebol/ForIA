import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, concatMap, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthData } from 'src/app/models/auth-data';
import { Register } from 'src/app/models/register';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { ResetPassword } from 'src/app/models/reset-password';
import { ChangePassword } from 'src/app/models/change-password';
import { MessageRes } from 'src/app/models/common/message-res';
import { Role } from 'src/app/models/receive/admin-role';

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
    id: string;
    hash: string;
    expires: string;
    signature: string;
  };

  private userSubject: BehaviorSubject<any>;
  public authData: Observable<{
    userData: User;
    userPreferences: UserPreferences;
  } | null>;

  constructor(private http: HttpClient) {
    this.baseURL = environment.url;
    this.apiAuthURL = environment.api + 'auth/';
    this.apiAdminURL = environment.api+'admin/';
    this.isAdmin = new BehaviorSubject(null);
    this.$isAdmin = this.isAdmin.asObservable();
    this.userSubject = new BehaviorSubject(null);
    this.authData = this.userSubject.asObservable();

    this.loading$ = new Subject();
  }

  completeLoad() {
    this.loading$.complete();
  }

  getRoleList(): Observable<{roles:Role[],actual:number[]}>{
    return this.http.get<{roles:Role[],actual:number[]}>(`${this.apiAdminURL}role/fakeRoles`);
  }

  // ADMIN
  getUserList(): Observable<{ id: number; nick: string }[]>{
    return this.http.get<{ id: number; nick: string }[]>(
      `${environment.adminUserList}`
    );
  }

  // ADMIN
  changeUser(user: number): Observable<MessageRes> {
    return this.http.get<MessageRes>(
      `${environment.adminLogin}${user}`
    );
  }
  changeRole(roles:number[]):Observable<MessageRes>{
    const body = {roles:roles}
    return this.http.post<MessageRes>(
      `${this.apiAdminURL}role/change`,body
    )
  }

  sendVerification(): Observable<any> {
    return this.http.get(`${this.apiAuthURL}resendVerification`);
  }

  verifyEmail(verification: any): Observable<any> {
    return this.http.get(
      `${this.apiAuthURL}verify/${verification.id}/${verification.hash}?expires=${verification.expires}&signature=${verification.signature}`
    );
  }

  requestPasswordReset(email: string): Observable<any> {
    const body = JSON.stringify({ email: email });
    return this.http.post(`${this.apiAuthURL}resetPassword`, body);
  }

  resetPassword(resetPassowrdData: ResetPassword): Observable<any> {
    let params = JSON.stringify(resetPassowrdData);
    return this.http.post(`${this.apiAuthURL}password`, params);
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
    return this.http.post(`${this.apiAdminURL}login`, params).pipe(
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
    return this.http.get(`${this.apiAdminURL}check`).pipe(
      map((r) => {
        if (r) {
          this.isAdmin.next(true);
        } else {
          this.isAdmin.next(false);
        }
        return r;
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

  logout(): Observable<MessageRes> {
    this.userSubject.next(null);
    this.isAdmin.next(null);
    return this.http.get<MessageRes>(`${this.apiAuthURL}logout`);
  }
}
