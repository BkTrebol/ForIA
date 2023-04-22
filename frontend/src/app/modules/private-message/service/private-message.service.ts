import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/app/environment/global';
import {
  ListPm,
  PrivateMessage,
  PrivateMessageList,
  newPrivateMessage,
} from 'src/app/models/receive/list-pm';

@Injectable({
  providedIn: 'root',
})
export class PrivateMessageService {
  private apiPrivateMessageURL: string;

  constructor(private http: HttpClient) {
    this.apiPrivateMessageURL = Global.api + 'pm/';
  }

  getReceived(page: number): Observable<ListPm> {
    return this.http.get<ListPm>(
      `${this.apiPrivateMessageURL}received/?page=${page}`
    );
  }
  
  getSent(page: number): Observable<ListPm> {
    return this.http.get<ListPm>(
      `${this.apiPrivateMessageURL}sent/?page=${page}`
    );
  }

  getMessage(id: string, page: number): Observable<PrivateMessageList> {
    return this.http.get<PrivateMessageList>(
      `${this.apiPrivateMessageURL}${id}?page=${page}`
    );
  }

  getUserList(): Observable<any> {
    return this.http.get<any>(`${Global.api}user/list/`);
  }

  getTopic(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiPrivateMessageURL}topic/${id}`);
  }

  sendMessage(message: newPrivateMessage): Observable<any> {
    return this.http.post(`${this.apiPrivateMessageURL}new/`, message);
  }
}
