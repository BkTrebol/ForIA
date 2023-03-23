import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthData } from 'src/app/models/auth-data';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../styles/user-form.scss'],
})
export class LoginComponent implements OnInit {
  public error: string;
  public authData: AuthData;
  public formLogin: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public validationMessagesLogin = {
    email: {
      required: 'Email is Required',
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 30',
      email: 'Invalid Email',
    },
    password: {
      required: 'Password is Required',
      minlength: 'Min Length is 8',
      pattern: 'Invalid Password',
    },
  };

  constructor(private _authService: AuthService, private router: Router) {
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

  // Login the user
  submit() {
    if (this.formLogin.valid) {
      this._authService.login(this.authData).subscribe({
        next: (res) => {
          this.error = '';
          this.router.navigate(['/user/profile']);
        },
        error: (err) => {
          this.error = err.error.message;
          this.formLogin.controls['password'].reset();
        },
      });
    } else {
      this.error = 'Invalid data in the Form';
    }
  }

  get email() {
    return this.formLogin.get('email');
  }
  get password() {
    return this.formLogin.get('password');
  }

  ngOnInit() {
    this._authService.getCSRF();
  }
}
