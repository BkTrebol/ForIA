import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public apiSidebarURL: string;

  constructor(private http: HttpClient) {
    this.apiSidebarURL = environment.api + 'sidebar/';
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
    return this.http.put(`${environment.api}preferences/sidebar`, JSON.stringify({ 'sidebar': s }))
  }
}
