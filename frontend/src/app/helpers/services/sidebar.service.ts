import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/environment/global';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor(
    private http: HttpClient
  ) { }


  getData():Observable<any>{
    return this.http.get(`${Global.api}user/sidebar`)
  }

  getPosts():Observable<any>{
    return this.http.get(`${Global.api}post/lastFive`);
  }
}
