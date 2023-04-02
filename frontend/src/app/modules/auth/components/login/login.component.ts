import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, first, takeUntil } from 'rxjs';
import { AuthData } from 'src/app/models/auth-data';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../../styles/user-form.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public error: string;
  public loading: boolean;
  public canShow: boolean;
  public authData: AuthData;
  public formLogin: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
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

  constructor(private _authService: AuthService, private router: Router) {
    this.unsubscribe$ = new Subject();
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
          Validators.pattern('^[a-zA-Z0-9]+$'), //TODO change pattern more secure
        ],
      ],
      remember_me: [false, []],
    });
  }

  ngOnInit() {
    // this._authService.authData
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((r) => {
    //     if (r) this.router.navigate(['/']);
    //   });
    this._authService.getCSRF();
  }

  // Login the user
  submit() {
    if (this.formLogin.valid) {
      this.loading = true;
      this._authService
        .login2(this.authData)
        // .pipe(first())
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this._authService
              .checkLogin()
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: (res) => {
                  this.error = '';
                  this.loading = false;
                  console.log('loginggg', res);
                  this.router.navigate(['/user/profile']);
                },
              });
            // this.error = '';
            // this.loading = false;
            // console.log("loginggg", res);
            // this.router.navigate(['/user/profile']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error.message; //Maybe split
            this.formLogin.controls['password'].reset();
          },
        });
    } else {
      this.error = 'Invalid data in the Form';
    }
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
