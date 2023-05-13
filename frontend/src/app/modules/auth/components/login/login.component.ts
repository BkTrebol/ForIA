import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthData } from 'src/app/models/auth-data';
import { AuthService } from '../../service/auth.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../../styles/user-form.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public error: string;
  public loading: boolean;
  public canShow: boolean;
  public authData: AuthData;
  public formLogin: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public googleEmail: string;
  public validationMessagesLogin = {
    email: {
      required: 'Email is Required',
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 255',
      email: 'Invalid Email',
    },
    password: {
      required: 'Password is Required',
      minlength: 'Min Length is 8',
      pattern: 'Invalid Password',
    },
  };

  constructor(
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {
    this.googleEmail = '';
    this.unsubscribe$ = new Subject();
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.loading = false;
    this.canShow = false;
    this.authData = { email: '', password: '', remember_me: false };
    this.formBuilderNonNullable = new FormBuilder().nonNullable;
    this.formLogin = this.formBuilderNonNullable.group({
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
          Validators.email,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^[a-zA-Z0-9_+-]+$'), //TODO change pattern more secure
        ],
      ],
      remember_me: [false, []],
    });
  }

  ngOnInit():void {
    this.googleEmail = this.route.snapshot.queryParams['email']??'';
    if (this.googleEmail != ''){
      this.authData.email = this.googleEmail;
      this.formLogin.get('email')?.disable();
    }
    this._authService.authData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        if (r) this.router.navigate(['/']);
      });
    this._authService.getCSRF();
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  // Login the user
  submit() {
    if (this.formLogin.valid) {
      this.loading = true;
      this._authService
        .login(this.authData,this.googleEmail != '')
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.error = '';
            this.loading = false;
            if(this._authService.verification){
              this.verifyEmail();
            }
            this.router.navigateByUrl(
              this.route.snapshot.queryParams['returnUrl'] || '/'
            );
            this.toastService.show(res.message);
          },
          error: (err) => {
            console.log('Err (login ts):', err);
            this.loading = false;
            this.error = err.error.message;
            this.formLogin.controls['password'].reset();
          },
        });
    } else {
      this.error = 'Invalid data in the Form';
    }
  }

  verifyEmail(){
    this._authService.verifyEmail(this._authService.verification)
    .subscribe(
      r => {
        this.toastService.show("Email verified")
        this.toastService.verificationToast = [];
        this._authService.verification = undefined;
      }
    )
  }
  changeShow() {
    this.canShow = !this.canShow;
  }

  get email() {
    return this.formLogin.get('email');
  }
  get password() {
    return this.formLogin.get('password');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
