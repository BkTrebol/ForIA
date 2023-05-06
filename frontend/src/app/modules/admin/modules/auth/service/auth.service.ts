import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concatMap, map } from 'rxjs';
import { AuthData } from 'src/app/models/auth-data';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
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
    let params = JSON.stringify(authData);
    return this._http
      .post(`${this.apiUrl}login`, params)
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

    checkLogin(): Observable<any> {
    return this._http.get(`${this.apiUrl}data`).pipe(
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
}
