import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private _authService: AuthService, private router: Router) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isAuth = this._authService.user;
    if (!isAuth || isAuth === null) {
      return this._authService.checkLogin().pipe(
        map((res) => {
          if (!res || res === null) {
            this.router.navigate(['/auth/login']);
            return false;
          } else {
            return true;
          }
        }),
        catchError((err) => {
          this.router.navigate(['/auth/login']);
          return of(false);
        })
      );
    } else {
      return true;
    }
  }
}