import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/environment/global';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public apiSidebarURL: string;

  constructor(private http: HttpClient) {
    this.apiSidebarURL = Global.api + 'sidebar/';
  }

  getData(): Observable<any> {
    return this.http.get(`${this.apiSidebarURL}userStats`);
  }

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiSidebarURL}lastFive`);
  }

  getForumStats(): Observable<any> {
    return this.http.get(`${this.apiSidebarURL}forumStats`);
  }

  editSidebar(s: boolean): Observable<any> {
    return this.http.put(`${Global.api}preferences/sidebar`, JSON.stringify({ 'sidebar': s }))
  }
}
