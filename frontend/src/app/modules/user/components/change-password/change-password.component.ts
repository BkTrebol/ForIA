import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, first, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/service/auth.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ChangePassword } from 'src/app/models/change-password';
import { UserService } from '../../service/user.service';
import { ToastService } from 'src/app/helpers/services/toast.service';

// Custom Validator
function passwordMatchValidator(control: AbstractControl) {
  const password = control?.get('password');
  const confirmPassword = control?.get('password_confirmation');

  if (password?.value !== confirmPassword?.value) {
    let errors = confirmPassword?.errors ?? {};
    errors['mismatch'] = true;
    confirmPassword?.setErrors(errors);
    return { passwordMismatch: true };
  } else {
    let errors: ValidationErrors = confirmPassword?.errors ?? [];
    delete errors['mismatch'];
    confirmPassword?.setErrors(Object.keys(errors).length == 0 ? null : errors);
    return null;
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: [
    './change-password.component.scss',
    '../../../../styles/user-form.scss',
  ],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public error: string;
  public loading: boolean;
  public canShowOld: boolean;
  public canShow: boolean;
  public canShowConf: boolean;
  public changePasswordData: ChangePassword;
  public formChangePassword: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public validationMessagesChangePassword = {
    old_password: {
      required: 'Password is Required',
      minlength: 'Min Length is 8',
      pattern: 'Invalid Password',
      mismatch: 'Password mismatch with your actual password',
    },
    password: {
      required: 'Password is Required',
      minlength: 'Min Length is 8',
      pattern: 'Invalid Password',
    },
    password_confirmation: {
      required: 'Password Confirmation is Required',
      minlength: 'Min Length is 8',
      mismatch: 'Password confirmation mismatch',
    },
  };

  constructor(
    private toastService: ToastService,
    private _userService: UserService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.unsubscribe$ = new Subject();
    this.theme = themeService.getTheme();
    this.error = '';
    this.loading = false;
    this.canShowOld = false;
    this.canShow = false;
    this.canShowConf = false;
    this.changePasswordData = {
      old_password: '',
      password: '',
      password_confirmation: '',
    };
    this.formBuilderNonNullable = new FormBuilder().nonNullable;
    this.formChangePassword = this.formBuilderNonNullable.group(
      {
        old_password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^[a-zA-Z0-9_!$%&/()?+-]+$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^[a-zA-Z0-9_!$%&/()?+-]+$'),
          ],
        ],
        password_confirmation: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  // Change user Password
  submit() {
    if (this.formChangePassword.valid) {
      this.loading = true;
      this._userService
        .changePassword(this.changePasswordData)
        .pipe(first())
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.error = '';
            this.loading = false;
            this.toastService.show(res.message);
            this.router.navigate(['']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error.message;
            this.formChangePassword.controls['old_password'].reset();
            this.formChangePassword.controls['password'].reset();
            this.formChangePassword.controls['password_confirmation'].reset();
            // Show the errors from the backend
            if (err.error.errors.old_password) {
              this.formChangePassword.controls['old_password'].setErrors({
                mismatch: true,
              });
              this.formChangePassword.controls['old_password'].markAsTouched();
            }
            if (err.error.errors.password) {
              this.formChangePassword.controls[
                'password_confirmation'
              ].setErrors({
                mismatch: true,
              });
              this.formChangePassword.controls[
                'password_confirmation'
              ].markAsTouched();
            }
          },
        });
    } else {
      this.error = 'Invalid data in the Form';
    }
  }

  changeShowOld() {
    this.canShowOld = !this.canShowOld;
  }

  changeShow() {
    this.canShow = !this.canShow;
  }

  changeShowConf() {
    this.canShowConf = !this.canShowConf;
  }

  get old_password() {
    return this.formChangePassword.get('old_password');
  }
  get password() {
    return this.formChangePassword.get('password');
  }
  get password_confirmation() {
    return this.formChangePassword.get('password_confirmation');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
