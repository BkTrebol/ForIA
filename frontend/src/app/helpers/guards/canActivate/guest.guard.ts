import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
@Injectable({
  providedIn: 'root',
})
export class GuestGuard {
  constructor(private _authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isAuth = this._authService.user;
    if (!isAuth || isAuth === null) {
      // Provisional perquè no funcionava si recarregaves la pàgina
      return this._authService.checkLogin().pipe(
        map((res) => {
          if (!res || res === null) {
            return true;
          } else {
            this.router.navigate(['/']);
            return false;
          }
        }),
        catchError((err) => {
          return of(true);
        })
      );
    }
    return true;
  }
}
