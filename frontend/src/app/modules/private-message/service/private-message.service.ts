import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/app/environment/global';
import { ListPm, PrivateMessage } from 'src/app/models/receive/list-pm';

@Injectable({
  providedIn: 'root'
})
export class PrivateMessageService {

  private apiPrivateMessageURL: string;
  constructor(
    private http: HttpClient
    ) { 
      this.apiPrivateMessageURL = Global.api + 'pm/';
    }

    getList():Observable<ListPm>{
      return this.http.get<ListPm>(this.apiPrivateMessageURL)
    }

    getMessage(id:string):Observable<PrivateMessage>{
      return this.http.get<PrivateMessage>(this.apiPrivateMessageURL+id);
    }
}
