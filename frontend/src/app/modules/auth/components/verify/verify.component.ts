import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import {  TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  public verification: {
    id: string,
    hash: string,
    expires: string,
    signature: string,
  }

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private _translateService: TranslateService
  ) {
    this.verification = {
      id: this.route.snapshot.params['id'],
      hash: this.route.snapshot.params['hash'],
      expires: this.route.snapshot.queryParams['expires'],
      signature: this.route.snapshot.queryParams['signature'],
    }
    if(this.toastService.verificationToast.length > 0){
      this.toastService.verificationToast.forEach(toast =>{
        this.toastService.remove(toast,'verification')
      });
    }
  }

  ngOnInit() {
    this.authService.verification = this.verification;
    this.authService.isLogged()
    .subscribe((r) => {
      if(r){
        this.authService.verifyEmail(this.verification)
        .subscribe({
          next: () => {
            this.authService.verification = undefined;
            this.toastService.clear();
            this.toastService.show(this._translateService.instant("EMAIL_VERIFIED"));
            this.router.navigate(['/']);
          },
          error: err => {
            this.toastService.show(this._translateService.instant(err));
            this.router.navigate(['/auth/login']);
          }
        })
      } else{
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
