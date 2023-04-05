import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivateFn,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
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
      // this.router.navigate(['/auth/login'], {
      //   queryParams: { returnUrl: state.url },
      // });
      // return false;
    } else {
      return true;
    }
  }
}

// export const authGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (!authService.getIsAuth()) {
//     router.navigate(['/auth/login']);
//     return false;
//   }
//   return true;
// };
