import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  constructor(private toastService: ToastService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      map((res) => {
        return res;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error.error.message) // DEBUG
        if (error.error instanceof ErrorEvent) {
          // console.log('This is client side error');
          // errorMsg = `Error: ${error.error.message}`;
        } else {
          if (error.status === 500) {
            this.toastService.showDanger('Server error');
          } else if (error.status === 403) {
            this.toastService.showDanger('Unauthorized');
          } else if (
            error.status === 401 &&
            !error.url?.includes('/auth/data')
          ) {
            this.toastService.showDanger('Unauthenticated');
          // } else if (error.status === 422) {
          //   this.toastService.showDanger('Invalid form data');
          } else if (error.status === 404) {
            this.toastService.showDanger('Page not found');
          } else if (!error.url?.includes('/auth/data')) {
            // this.toastService.showDanger('Unknown Error');
          } else {
            // throwError(null);
          }

          // console.log('This is server side error');
          // errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        return throwError(() => error);
      })
    );
  }
}
