import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
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

  constructor(private _authService: AuthService, private fb: FormBuilder) {
    this.error = "";
    // this.authData = {email: "", password: "", remember_me: false};
    this.authData = new AuthData("", "", false);
  }

  formLogin = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.email,
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^[a-zA-Z0-9]+$'),
      ],
    ],
    remember_me: [
      false, []
    ]
  });

  validationMessagesLogin = {
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

  submit() {
    if (this.formLogin.valid) {
      console.log(this.authData);
      console.log(this.formLogin.value);
      this._authService.login(this.authData).subscribe({
        next: (a) => console.log(a),
        error: (e) => {
          this.error = e.error;
          console.log(e)
        },
      });
      this.error = '';
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
