import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageRes } from 'src/app/models/common/message-res';
import { ForumStats } from 'src/app/models/receive/forum-stats';
import { LastPosts } from 'src/app/models/receive/last-posts';
import { UserStats } from 'src/app/models/receive/user-stats';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public apiSidebarURL: string;

  constructor(private http: HttpClient) {
    this.apiSidebarURL = environment.api + 'sidebar/';
  }

  getData(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiSidebarURL}userStats`);
  }

  getPosts(): Observable<LastPosts[]> {
    return this.http.get<LastPosts[]>(`${this.apiSidebarURL}lastFive`);
  }

  getForumStats(): Observable<ForumStats> {
    return this.http.get<ForumStats>(`${this.apiSidebarURL}forumStats`);
  }

  editSidebar(s: boolean): Observable<MessageRes> {
    return this.http.put<MessageRes>(`${environment.api}preferences/sidebar`, JSON.stringify({ 'sidebar': s }))
  }
}
