import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concatMap, map } from 'rxjs';
import { AuthData } from 'src/admin/models/auth-data';
import { User } from 'src/admin/models/user';
import { UserPreferences } from 'src/admin/models/user-preferences';
import { Global } from 'src/environment/global';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public apiUrl: string;
  private userSubject: BehaviorSubject<any>;
  public authData: Observable<{
    userData: User;
    userPreferences: UserPreferences;
  } | null>;
  
  constructor(
    private _http: HttpClient,
  ) { 
    this.apiUrl = Global.api+'admin/';
    this.userSubject = new BehaviorSubject(null);
    this.authData = this.userSubject.asObservable();

  }
  getCSRF(): Observable<any> {
    return this._http.get<any>(`${Global.api}/sanctum/csrf-cookie`);
  }

  login(authData:AuthData): Observable<any> {
    const patata = {
      email: authData.email,
      password: authData.password,
      admin: true
    };
    let params = JSON.stringify(authData);
    console.log(params)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this._http
      .post(`${this.apiUrl}login`, params,{headers:headers})
      .pipe(
        concatMap((r) => {
          console.log(r)
          return this.checkLogin().pipe(
            map((checkR) => {
              return r;
            })
          );
        })
      );
  }

    checkLogin(): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });
    return this._http.get(`${this.apiUrl}data`,{headers:headers,withCredentials:true}).pipe(
      map((r) => {
        this.userSubject.next(r);
        console.log(r)
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
}
