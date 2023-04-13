import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from 'src/app/modules/user/service/user.service';
import { PublicUserProfile } from 'src/app/models/receive/user-profile';

@Injectable({
  providedIn: 'root',
})
export class ShowProfileResolver
  implements Resolve<boolean | PublicUserProfile>
{
  constructor(private userService: UserService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | PublicUserProfile> {
    const id = route.paramMap.get('id') ?? '';
    return this.userService.getProfile(id).pipe(
      map((res) => {
        if (res) {
          return res;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }),
      catchError((err) => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
