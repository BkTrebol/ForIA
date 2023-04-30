import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../../environment/global';
import { UserPreferences } from '../../../models/user-preferences';
import { EditUserProfile } from 'src/app/models/receive/edit-user-profile';
import { UserProfile } from 'src/app/models/send/public-user-profile';
import { PublicUserProfile } from 'src/app/models/receive/user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUserURL: string;

  constructor(private http: HttpClient) {
    this.apiUserURL = Global.api + 'user/';
  }

  getEdit(): Observable<EditUserProfile> {
    return this.http.get<EditUserProfile>(`${this.apiUserURL}edit`);
  }

  getPreferences(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(`${this.apiUserURL}preference`);
  }

  getProfile(id: string): Observable<PublicUserProfile> {
    return this.http.get<PublicUserProfile>(`${this.apiUserURL}profile/${id}`);
  }

  getStatistics(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUserURL}statistics/${id}`);
  }

  getPostsTopic(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUserURL}statistics2/${id}`);
  }

  editProfile(user: UserProfile): Observable<any> {
    let headers: HttpHeaders;
    let params = JSON.stringify(user);
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post(`${this.apiUserURL}edit`, params, {
      headers: headers,
    });
  }

  editProfileWithImage(user: UserProfile, image: Array<File>): Observable<any> {
    let postData: FormData;
    let headers = new HttpHeaders({
      Accept: 'application/json',
    });
    postData = new FormData();
    postData.append('nick', user.nick);
    postData.append('email', user.email);
    postData.append('location', user.location ?? '');
    postData.append('birthday', user.birthday ?? '');
    postData.append('avatar', image[0], image[0].name);
    postData.append('deleteAvatar', JSON.stringify(user.deleteAvatar));
    return this.http.post(`${this.apiUserURL}edit`, postData, {
      headers: headers,
    });
  }

  editPreferences(
    preferences: UserPreferences
  ): Observable<{ message: string }> {
    let params = JSON.stringify(preferences);
    return this.http.put<{ message: string }>(
      `${this.apiUserURL}preference`,
      params
    );
  }
}
