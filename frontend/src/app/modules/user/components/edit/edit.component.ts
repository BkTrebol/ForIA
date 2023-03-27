import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthData } from 'src/app/models/auth-data';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss', '../../../../styles/user-form.scss'],
})
export class EditComponent implements OnInit {
  error!: string;

  public user: AuthData;
  constructor(private _authService: AuthService, private fb: FormBuilder) {
    this.user = { email: '', password: '', remember_me: true };
  }

  ngOnInit() {
    // this._userService.getCSRF();
  }

  formEditProfile = this.fb.group({
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
    location: ['', [Validators.minLength(3), Validators.maxLength(64)]],
    birthday: ['', [Validators.minLength(3), Validators.maxLength(64)]],
    avatar: ['', []], //Validators.minLength(3), Validators.maxLength(64)]],
  });

  validationMessagesEditProfile = {
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
    location: {
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 30',
    },
    birthday: {
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 64',
    },
    avatar: {
      // minlength: 'Min Length is 3',
      // maxlength: 'Max Length is 64',
    },
  };

  submit() {
    if (this.formEditProfile.valid) {
      // this.formEditProfile.value (1 argument)
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
    return this.formEditProfile.get('nick');
  }
  get email() {
    return this.formEditProfile.get('email');
  }
  get location() {
    return this.formEditProfile.get('location');
  }
  get birthday() {
    return this.formEditProfile.get('birthday');
  }
  get avatar() {
    return this.formEditProfile.get('avatar');
  }
}
