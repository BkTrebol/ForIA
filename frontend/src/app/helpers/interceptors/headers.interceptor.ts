import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Global } from '../../../environment/global';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  private headers: HttpHeaders;
  private url: string;
  constructor() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    this.url = Global.url;
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check if our Api Url
    const isApiUrl = request.url.startsWith(this.url);
    const isFormData =
      request.url.startsWith(this.url + 'api/user/edit') ||
      request.url.startsWith(this.url + 'api/admin/user/update')
      // request.url.startsWith(this.url + 'api/admin/category/update');
    const isPost = request.method === 'POST'
    if (isApiUrl) {
      // Check if doesen't need to change the headers
      if (isFormData && isPost) {
        request = request.clone({
          withCredentials: true
        });
      } else {
        request = request.clone({
          headers: this.headers,
          withCredentials: true,
        });
      }
    }
    return next.handle(request);
  }
}
