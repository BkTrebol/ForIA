import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from 'src/app/modules/user/service/user.service';
import { EditUserProfile } from 'src/app/models/receive/edit-user-profile';

@Injectable({
  providedIn: 'root',
})
export class EditProfileResolver implements Resolve<boolean | EditUserProfile> {
  constructor(private userService: UserService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | EditUserProfile> {
    return this.userService.getEdit().pipe(
      map((res) => {
        if (res) {
          return res;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }),
      catchError((err) => {
        this.router.navigate(['/error']);
        return of(false);
      })
    );
  }
}
