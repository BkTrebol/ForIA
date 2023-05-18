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
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ChangePassword } from 'src/app/models/change-password';
import { UserService } from '../../service/user.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

// Custom Validator
function passwordMatchValidator(control: AbstractControl) {
  const password = control?.get('password');
  const confirmPassword = control?.get('password_confirmation');

  if (password?.value !== confirmPassword?.value) {
    const errors = confirmPassword?.errors ?? {};
    errors['mismatch'] = true;
    confirmPassword?.setErrors(errors);
    return { passwordMismatch: true };
  } else {
    const errors: ValidationErrors = confirmPassword?.errors ?? [];
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
  public canShowOld: boolean;
  public canShow: boolean;
  public canShowConf: boolean;
  public changePasswordData: ChangePassword;
  public formChangePassword: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public sending: boolean;
  public validationMessagesChangePassword = {
    old_password: {
      required: '',
      minlength: '',
      pattern: '',
      mismatch: '',
    },
    password: {
      required: '',
      minlength: '',
      pattern: '',
    },
    password_confirmation: {
      required: '',
      minlength: '',
      mismatch: '',
    },
  };

  constructor(
    private toastService: ToastService,
    private _userService: UserService,
    private router: Router,
    private themeService: ThemeService,
    private _translateService: TranslateService
  ) {
    this.sending = false;
    this.unsubscribe$ = new Subject();
    this.theme = themeService.getTheme();
    this.error = '';
    this.canShowOld = false;
    this.canShow = false;
    this.canShowConf = false;
    this.changePasswordData = {
      old_password: '',
      password: '',
      password_confirmation: '',
    };
    (this.validationMessagesChangePassword = {
      old_password: {
        required: _translateService.instant('VALIDATION.PASSWORD.REQUIRED'),
        minlength: _translateService.instant('VALIDATION.PASSWORD.MIN'),
        pattern: _translateService.instant('VALIDATION.PASSWORD.PATTERN'),
        mismatch: _translateService.instant('VALIDATION.PASSWORD.MISMATCH'),
      },
      password: {
        required: _translateService.instant('VALIDATION.PASSWORD.REQUIRED'),
        minlength: _translateService.instant('VALIDATION.PASSWORD.MIN'),
        pattern: _translateService.instant('VALIDATION.PASSWORD.PATTERN'),
      },
      password_confirmation: {
        required: _translateService.instant(
          'VALIDATION.PASSWORD_CONFIRMATION.REQUIRED'
        ),
        minlength: _translateService.instant(
          'VALIDATION.PASSWORD_CONFIRMATION.MIN'
        ),
        mismatch: _translateService.instant(
          'VALIDATION.PASSWORD_CONFIRMATION.MISMATCH'
        ),
      },
    }),
      (this.formBuilderNonNullable = new FormBuilder().nonNullable);
    this.formChangePassword = this.formBuilderNonNullable.group(
      {
        old_password: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$'),
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
    this.sending = true;
    if (this.formChangePassword.valid) {
      this._userService
        .changePassword(this.changePasswordData)
        .pipe(first())
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.sending = false;
            this.error = '';
            this.toastService.show(this._translateService.instant(res.message));
            this.router.navigate(['']);
          },
          error: (err) => {
            this.sending = false;
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
      this.error = this._translateService.instant('VALIDATION.WRONG_FORMDATA');
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
