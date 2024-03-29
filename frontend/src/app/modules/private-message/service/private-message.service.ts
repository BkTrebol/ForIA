import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ListPm,
  PrivateMessageList,
  newPrivateMessage,
} from 'src/app/models/receive/list-pm';
import { MessageRes } from 'src/app/models/common/message-res';

@Injectable({
  providedIn: 'root',
})
export class PrivateMessageService {
  private apiPrivateMessageURL: string;

  constructor(private http: HttpClient) {
    this.apiPrivateMessageURL = environment.api + 'pm/';
  }

  delete(sentArray: number[], receivedArray: number[]): Observable<MessageRes> {
    const body = JSON.stringify({
      sentMessages: sentArray,
      receivedMessages: receivedArray,
    });
    return this.http.delete<MessageRes>(`${this.apiPrivateMessageURL}`, {
      body: body,
    });
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

  getMessages(
    rpage: number,
    spage: number
  ): Observable<{ received: ListPm; sent: ListPm }> {
    return this.http.get<{ received: ListPm; sent: ListPm }>(
      `${this.apiPrivateMessageURL}?rpage=${rpage}&spage=${spage}`
    );
  }

  getMessage(id: string, page: number): Observable<PrivateMessageList> {
    return this.http.get<PrivateMessageList>(
      `${this.apiPrivateMessageURL}${id}?page=${page}`
    );
  }

  getUserList(): Observable<any> {
    return this.http.get<any>(`${environment.api}user/list/`);
  }

  // getTopic(id: number): Observable<any> {
  //   return this.http.get<any>(`${this.apiPrivateMessageURL}topic/${id}`);
  // }

  getThread(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiPrivateMessageURL}reply/${id}`);
  }

  sendMessage(message: newPrivateMessage): Observable<any> {
    return this.http.post(`${this.apiPrivateMessageURL}new/`, message);
  }
}
