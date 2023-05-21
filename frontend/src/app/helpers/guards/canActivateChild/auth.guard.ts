import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(private _authService: AuthService, private router: Router) {}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isAuth = this._authService.user;
    if (!isAuth || isAuth === null) {
      return this._authService.isLogged().pipe(
        map((res) => {
          if (!res) {
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: state.url },
            });
            return false;
          } else {
            return true;
          }
        }),
        catchError(() => {
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url },
          });
          return of(false);
        })
      );
    } else {
      return true;
    }
  }
}
