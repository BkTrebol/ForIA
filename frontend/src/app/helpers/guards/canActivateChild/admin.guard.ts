import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
class AdminService{
  constructor(private _authService: AuthService,private router:Router){}
  canActivate(){
    if(this._authService.isAdmin.value == null){
      return this._authService.checkAdmin()
      .pipe(
        map (r => {
        if (!r){
          this.router.navigate(['admin/login']);
          return false;
        } else return true;
      }))
      ;
    } else if(this._authService.isAdmin){
      return true;
    } else {
      this.router.navigate(['admin/login']);
      return false;
    }
  }
}

export const canActivateAdmin:CanActivateChildFn =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return inject(AdminService).canActivate()
  }
