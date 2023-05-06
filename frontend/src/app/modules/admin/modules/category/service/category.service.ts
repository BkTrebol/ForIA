import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Global } from 'src/environment/global';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl: string;
  constructor(
    private _http: HttpClient,
  ) { 
    this.apiUrl = Global.api+'admin/';
  }


  categories(): Observable<any> {
    return this._http.get<any>(`${Global.api}category/`);
  }

}
