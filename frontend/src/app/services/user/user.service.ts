import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../global';
import { UserPreferences } from '../../models/user-preferences';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUserURL: string;
  public userPreferences: UserPreferences;

  constructor(private http: HttpClient) {
    this.apiUserURL = Global.url + 'user/';
    this.userPreferences = {
      id_user: 0,
      sidebar: true,
      filter_bad_words: false,
      allow_view_profile: true,
      allow_users_to_mp: true,
      hide_online_presence: false,
      two_fa: false,
      allow_music: false,
    };
  }

  preferences(): Observable<any> {
    return this.http.get(`${this.apiUserURL}preference`);
  }

  userCard(): Observable<any> {
    return this.http.get(`${this.apiUserURL}user-card`)
  }

  editUser(user: User): Observable<any> {
    let params = JSON.stringify(user);
    return this.http.put(`${this.apiUserURL}edit`, params)
  }
}
