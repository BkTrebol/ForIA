import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
        // console.log(error.error.message) // DEBUG
        if (error.error instanceof ErrorEvent) {
          // console.log('This is client side error');
        } else {
          if (error.status === 500) {
            this.toastService.showDanger('Server error');
          } else if (
            error.status === 403
          ) {
            this.toastService.showDanger('Unauthorized');
          } else if (
            error.status === 401 &&
            !error.url?.includes('/auth/data') &&
            !error.url?.includes('/admin/login') &&
            !error.url?.includes('/auth/login') &&
            !error.url?.startsWith('/auth/login')
          ) {
            this.toastService.showDanger('Unauthenticated');
          } else if (error.status === 404) {
            this.toastService.showDanger('Page not found');
          } else if (!error.url?.includes('/auth/data')) {
            // this.toastService.showDanger('Unknown Error');
          }

        }

        return throwError(() => error);
      })
    );
  }
}
