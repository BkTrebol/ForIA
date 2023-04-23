import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CategoryResolver implements Resolve<boolean> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return route.fragment == 'googleauth';
  }
}
