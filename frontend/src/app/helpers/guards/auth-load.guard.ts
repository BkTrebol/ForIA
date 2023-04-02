import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthLoadGuard implements CanLoad {
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
      // Provisional perquè no funcionava si recarregaves la pàgina
      this._authService.checkLogin().subscribe({
        next: (res) => {
          if (!res || res === null) {
            this.router.navigate(['/auth/login']);
            return false;
          } else {
            return true;
          }
        },
        error: (err) => {
          this.router.navigate(['/auth/login']);
          return false;
        },
      });
      // this.router.navigate(['/auth/login']);
      // return false;
    }
    return true;
  }
}
