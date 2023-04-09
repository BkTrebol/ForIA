import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from '../../../environment/global';
import { UserPreferences } from '../../../models/user-preferences';
import { EditUserProfile } from 'src/app/models/receive/edit-user-profile';
import { UserProfile } from 'src/app/models/send/user-profile';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUserURL: string;
  public userPreferences: UserPreferences;

  constructor(private http: HttpClient) {
    this.apiUserURL = Global.api + 'user/';
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

  getEdit(): Observable<any> {
    return this.http.get(`${this.apiUserURL}edit`);
  }

  getPreferences(): Observable<any> {
    return this.http.get(`${this.apiUserURL}preference`);
  }

  userCard(): Observable<any> {
    return this.http.get(`${this.apiUserURL}user-card`);
  }

  editProfile(user: UserProfile, image: Array<File>): Observable<any> {
    let headers: HttpHeaders;
    let postData: string | FormData;
    const isImage = image.length >= 0 ? typeof image[0] === 'object' : false;
    // console.log('Service', user, 'is Image', isImage, typeof user.avatar);
    if (isImage) {
      headers = new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      });
      postData = new FormData();
      postData.append('nick', user.nick);
      postData.append('email', user.email);
      postData.append('location', user.location);
      postData.append('birthday', user.birthday);
      postData.append('avatar', image[0], image[0].name);
    } else {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });
      postData = JSON.stringify(user);
    }
    return this.http.post(`${this.apiUserURL}edit`, postData, {
      headers: headers
    });
  }
}
