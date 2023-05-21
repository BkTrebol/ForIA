import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, first, takeUntil } from 'rxjs';
import { ResetPassword } from 'src/app/models/reset-password';
import { AuthService } from '../../service/auth.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import {  TranslateService } from '@ngx-translate/core';
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
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: [
    './reset-password.component.scss',
    '../../../../styles/user-form.scss',
  ],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public error: string;
  public errorEmail: string;
  public loading: boolean;
  public canShowOld: boolean;
  public canShow: boolean;
  public canShowConf: boolean;
  public email: string;
  public emailSend: boolean;
  public resetPasswordData: ResetPassword;
  public formSendEmail: FormGroup;
  public formResetPassword: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public validationMessagesSendEmail = {
    email: {
      required: 'Email is Required',
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 255',
      email: 'Invalid Email',
    },
  };
  public validationMessagesResetPassword = {
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
    private _authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private _translateService: TranslateService
  ) {
    this.unsubscribe$ = new Subject();
    this.theme = themeService.getTheme();
    this.error = '';
    this.errorEmail = '';
    this.loading = false;
    this.canShowOld = false;
    this.canShow = false;
    this.canShowConf = false;
    this.email = '';
    this.emailSend = false;
    this.resetPasswordData = {
      email:'',
      token:'',
      password: '',
      password_confirmation: '',
    };
    this.validationMessagesResetPassword = {
      old_password: {
        required: _translateService.instant("VALIDATION.PASSWORD.REQUIRED"),
        minlength: _translateService.instant("VALIDATION.PASSWORD.MIN"),
        pattern: _translateService.instant("VALIDATION.PASSWORD.PATTERN"),
        mismatch: _translateService.instant("VALIDATION.PASSWORD.MISMATCH"),
      },
      password: {
        required: _translateService.instant("VALIDATION.PASSWORD.REQUIRED"),
        minlength: _translateService.instant("VALIDATION.PASSWORD.MIN"),
        pattern: _translateService.instant("VALIDATION.PASSWORD.PATTERN"),
      },
      password_confirmation: {
        required: _translateService.instant("VALIDATION.PASSWORD_CONFIRMATION.REQUIRED"),
        minlength: _translateService.instant("VALIDATION.PASSWORD_CONFIRMATION.MIN"),
        mismatch: _translateService.instant("VALIDATION.PASSWORD_CONFIRMATION.MISMATCH"),
      },
    }
    this.formBuilderNonNullable = new FormBuilder().nonNullable;
    this.formSendEmail = this.formBuilderNonNullable.group({
      email: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
          Validators.email,
        ],
      ],
    });
    this.formResetPassword = this.formBuilderNonNullable.group(
      {
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
    this._authService.authData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        if (r) this.router.navigate(['/']);
      });
    this._authService.getCSRF();


    if(this.route.snapshot.queryParams.hasOwnProperty('token')){
      this.resetPasswordData.email = this.route.snapshot.queryParams['email'];
      this.resetPasswordData.token = this.route.snapshot.queryParams['token'];
      this.emailSend = true;
    }

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  // Send email
  sendEmail(): void {
    if (this.formSendEmail.valid) {
      this._authService.requestPasswordReset(this.formSendEmail.value.email)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(r => {
        this.toastService.show(this._translateService.instant(r.message));
      });
    } else {
      this.errorEmail = 'Invalid email';
      this.emailSend = false;
    }
  }

  // Reset Password of the user
  submit() {
    if (this.formResetPassword.valid) {
      this.loading = true;
      this._authService
        .resetPassword(this.resetPasswordData)
        .pipe(first())
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.error = '';
            this.loading = false;
            this.toastService.show(this._translateService.instant(res.message));
            this.router.navigate(['/auth/login']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error.message;
            this.formResetPassword.controls['password'].reset();
            this.formResetPassword.controls['password_confirmation'].reset();
            if (err.error.errors.password) {
              this.formResetPassword.controls[
                'password_confirmation'
              ].setErrors({
                mismatch: true,
              });
              this.formResetPassword.controls[
                'password_confirmation'
              ].markAsTouched();
            }
          },
        });
    } else {
      this.error = this._translateService.instant("VALIDATION.WRONG_FORMDATA");
    }
  }

  changeShow() {
    this.canShow = !this.canShow;
  }

  changeShowConf() {
    this.canShowConf = !this.canShowConf;
  }

  get gemail() {
    return this.formSendEmail.get('email');
  }
  get password() {
    return this.formResetPassword.get('password');
  }
  get password_confirmation() {
    return this.formResetPassword.get('password_confirmation');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
