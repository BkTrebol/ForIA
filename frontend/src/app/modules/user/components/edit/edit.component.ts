import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/modules/user/service/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss', '../../../../styles/user-form.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public error: string;
  public loading: boolean;
  public user: User;
  public formEditProfile: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public validationMessagesEditProfile = {
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
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 64',
    },
  };

  constructor(private userService: UserService, private router: Router) {
    this.unsubscribe$ = new Subject();
    this.error = '';
    this.loading = false;
    this.user = {
      id: 0,
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
      roles: [],
      created_at: '',
      updated_at: '',
    };
    this.formBuilderNonNullable = new FormBuilder().nonNullable;
    this.formEditProfile = this.formBuilderNonNullable.group({
      nick: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
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
      avatar: ['', [Validators.minLength(3), Validators.maxLength(64)]],
    });
  }

  ngOnInit() {
    // this.user = this.userService.userData;
  }

  submit(): void {
    if (this.formEditProfile.valid) {
      this.loading = true;
      this.error = '';
      this.userService
        .editUser(this.user)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.loading = false;
            this.router.navigate(['/user/profile']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error.message;
          },
        });
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
