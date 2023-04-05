import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Global } from '../../environment/global'

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  private headers: HttpHeaders;
  private ApiUrl: string;
  constructor() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    this.ApiUrl = Global.url;
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check if our Api Url
    const isApiUrl = request.url.startsWith(this.ApiUrl);

    if (isApiUrl) {
      request = request.clone({
        headers: this.headers,
        withCredentials: true
      });
    }
    return next.handle(request);
  }
}
