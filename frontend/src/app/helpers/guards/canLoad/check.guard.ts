import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CheckGuard implements CanLoad {
  constructor(private _authService: AuthService) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this._authService.isLogged().pipe(
      map((_) => {
        return true
      }),
      catchError((_) => {
        return of(true);
      })
    );
  }
}
