import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../environment/global';
// import { UserPreferences } from '../../../models/user-preferences';
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

  //EditUserProfile fet
  getEdit(): Observable<any> {
    return this.http.get(`${this.apiUserURL}edit`);
  }

  getProfile(id: string): Observable<PublicUserProfile> {
    return this.http.get<PublicUserProfile>(`${this.apiUserURL}profile/${id}`);
  }

  // getPreferences(): Observable<UserPreferences> {
  //   return this.http.get<UserPreferences>(`${this.apiUserURL}preference`);
  // }

  editProfileWithImage(user: UserProfile, image: Array<File>): Observable<any> {
    let postData: FormData;
    let headers = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data',
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
}
