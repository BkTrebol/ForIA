import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserPreferences } from '../../../models/user-preferences';
import { EditUserProfile } from 'src/app/models/receive/edit-user-profile';
import { UserProfile } from 'src/app/models/send/public-user-profile';
import { PublicUserProfile } from 'src/app/models/receive/user-profile';
import { ChangePassword } from 'src/app/models/change-password';
import { MessageRes } from 'src/app/models/common/message-res';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUserURL: string;

  constructor(private http: HttpClient) {
    this.apiUserURL = environment.api + 'user/';
  }

  getEdit(): Observable<EditUserProfile> {
    return this.http.get<EditUserProfile>(`${this.apiUserURL}edit`);
  }

  getPreferences(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(`${environment.api}preferences`);
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

  changePassword(changePasswordData: ChangePassword): Observable<MessageRes> {
    return this.http.put<MessageRes>(
      `${this.apiUserURL}password`,
      changePasswordData
    );
  }

  editProfile(user: UserProfile): Observable<MessageRes> {
    const params = JSON.stringify(user);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<MessageRes>(`${this.apiUserURL}edit`, params, {
      headers: headers,
    });
  }

  editProfileWithImage(
    user: UserProfile,
    image: Array<File>
  ): Observable<MessageRes> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    const postData = new FormData();
    postData.append('nick', user.nick);
    postData.append('email', user.email);
    postData.append('location', user.location ?? '');
    postData.append('birthday', user.birthday ?? '');
    postData.append('avatar', image[0], image[0].name);
    postData.append('deleteAvatar', JSON.stringify(user.deleteAvatar));
    return this.http.post<MessageRes>(`${this.apiUserURL}edit`, postData, {
      headers: headers,
    });
  }

  editPreferences(preferences: UserPreferences): Observable<MessageRes> {
    const params = JSON.stringify(preferences);
    return this.http.put<{ message: string }>(
      `${environment.api}preferences/all`,
      params
    );
  }

  dropUser(password: string, passwordConfirm: string): Observable<MessageRes> {
    const body = JSON.stringify({
      password: password,
      confirm: passwordConfirm,
    });
    return this.http.post<MessageRes>(`${this.apiUserURL}delete`, body);
  }
}
