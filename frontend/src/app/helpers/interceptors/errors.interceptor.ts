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
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
    //   .pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     if (error.status === 401) {
    //       console.log("AUTH DATA");
    //       return of(new HttpResponse({ body: {}, status: 0 }));
    //     } else {
    //       return throwError('server error');
    //     }
    //   })
    // );
    
    //   .pipe(
    //   catchError((error: HttpErrorResponse) => {
    //     let errorMsg = '';
    //     if (error.error instanceof ErrorEvent) {
    //       console.log('This is client side error');
    //       errorMsg = `Error: ${error.error.message}`;
    //     } else {
    //       if (error.status === 401) {
    //         console.log("AUTH DATA");
    //       }
    //       console.log('This is server side error');
    //       errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
    //     }
    //     console.log(errorMsg);
    //     return throwError(errorMsg);
    //   })
    // );
  }
}
