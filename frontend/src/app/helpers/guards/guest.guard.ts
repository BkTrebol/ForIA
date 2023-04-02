import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
@Injectable({
  providedIn: 'root',
})
export class GuestGuard {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const isAuth = this.authService.user;
    if (isAuth) {
      console.log("Is auth");

      this.router.navigate(['/user/profile']);
      return false;
    }
    console.log('NOOO Is auth', isAuth);
    return true;
  }
}
