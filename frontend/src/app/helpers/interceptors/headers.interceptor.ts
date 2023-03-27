import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  private headers: HttpHeaders;

  constructor() {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check if our Api

    const headersRequest = request.clone({
      headers: this.headers,
      withCredentials: true
    });
    return next.handle(headersRequest);
  }
}
