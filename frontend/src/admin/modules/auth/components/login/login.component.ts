import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthData } from 'src/admin/models/auth-data';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss','../../../../styles/style.scss'],
})
export class LoginComponent {
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
  constructor(
    private _authService: AuthService
  ){
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
    });
  }

  onSubmit(){
    // this._authService.login();
  }

  get email() {
    return this.formLogin.get('email');
  }
  get password() {
    return this.formLogin.get('password');
  }
}
