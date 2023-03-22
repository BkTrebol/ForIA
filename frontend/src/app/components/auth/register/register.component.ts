import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthData } from 'src/app/models/auth-data';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../styles/user-form.scss'],
})
export class RegisterComponent implements OnInit {
  public error: string;

  public user: AuthData;
  constructor(private _authService: AuthService, private fb: FormBuilder) {
    this.user = {email: '', password: '', remember_me: true}
    this.error = "";
  }

  ngOnInit() {
    // this._authService.getCSRF();
  }

  formRegister = this.fb.group({
    nick: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
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
    password_confirmation: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^[a-zA-Z0-9]+$'),
      ],
    ],
  });

  validationMessagesRegister = {
    nick: {
      required: 'Nick is Required',
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 30',
    },
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
    password_confirmation: {
      required: 'Password Confirmation is Required',
      minlength: 'Min Length is 8',
      pattern: 'Invalid Password Confirmation',
    },
  };

  submit() {
    if (this.formRegister.valid) {
      // this.formRegister.value (1 argument)
      // this._authService.login(this.email, this.password).subscribe({
      //   next: (a) => console.log(a),
      //   error: (e) => console.log(e),
      // });
      this.error = '';
    } else {
      this.error = 'Invalid data in the Form';
    }
  }

  get nick() {
    return this.formRegister.get('nick');
  }
  get email() {
    return this.formRegister.get('email');
  }
  get password() {
    return this.formRegister.get('password');
  }
  get password_confirmation() {
    return this.formRegister.get('password_confirmation');
  }
}
