import { Injectable } from '@angular/core';
import {
  CanActivateChild,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivateChild {
  constructor(private _authService: AuthService, private router: Router) {}
  canActivateChild(
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isAuth = this._authService.user;
    if (!isAuth || isAuth === null) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
