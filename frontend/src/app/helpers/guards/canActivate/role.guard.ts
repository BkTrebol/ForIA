import { Injectable } from '@angular/core';
import {
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const roles = this.authService.user.roles;
    if (!roles.includes('ROLE_ADMIN') || !roles.includes('ROLE_GOD')) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}