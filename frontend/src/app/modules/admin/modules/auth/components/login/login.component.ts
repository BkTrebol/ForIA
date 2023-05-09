import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthData } from 'src/app/models/auth-data';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public authData: AuthData;
  public formLogin: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public error: string;
  public loginLoading: boolean;
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
    },
  };

  constructor(private _authService: AuthService, private _router: Router) {
    this.unsubscribe$ = new Subject();
    this.loginLoading = false;
    this.error = '';
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
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this._authService.getCSRF();
  }

  onSubmit() {
    this.loginLoading = true;
    this.authData.email = this.email?.value;
    this.authData.password = this.password?.value;
    this._authService
      .adminLogin(this.authData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this._authService.checkAdmin().subscribe((r) => {
            this._router.navigate(['admin/dashboard']);
            this.loginLoading = false;
          });
        },
        error: (e) => {
          this.error = e.error.message;
          this.loginLoading = false;
          this.formLogin.controls['password'].reset();
        },
      });
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
