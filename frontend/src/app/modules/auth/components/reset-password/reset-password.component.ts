import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, first, takeUntil } from 'rxjs';
import { ResetPassword } from 'src/app/models/reset-password';
import { AuthService } from '../../service/auth.service';

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
    let errors = confirmPassword?.errors ?? [];
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

  constructor(private _authService: AuthService, private router: Router) {
    this.unsubscribe$ = new Subject();
    this.error = '';
    this.errorEmail = '';
    this.loading = false;
    this.canShowOld = false;
    this.canShow = false;
    this.canShowConf = false
    this.email = '';
    this.emailSend = false;
    this.resetPasswordData = {
      old_password: '',
      password: '',
      password_confirmation: '',
    };
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
        old_password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^[a-zA-Z0-9]+$'), //TODO change pattern more secure
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^[a-zA-Z0-9]+$'), // TODO change pattern
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

  ngOnInit() {
    // this._authService.authData
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((r) => {
    //     if (r) this.router.navigate(['/']);
    //   });
    this._authService.getCSRF();
  }

  //
  sendEmail() {
    if (this.formSendEmail.valid) {
      console.log('Sending email');
      this.emailSend = true;
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
            this.router.navigate(['/user/profile']);
          },
          error: (err) => {
            this.loading = false;
            this.error = err.error.message;
            this.formResetPassword.controls['old_password'].reset();
            this.formResetPassword.controls['password'].reset();
            this.formResetPassword.controls['password_confirmation'].reset();
            // Show the errors from the backend
            if (err.error.errors.old_password) {
              this.formResetPassword.controls['old_password'].setErrors({
                mismatch: true,
              });
              this.formResetPassword.controls['old_password'].markAsTouched();
            }
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

  get gemail() {
    return this.formSendEmail.get('email');
  }
  get old_password() {
    return this.formResetPassword.get('old_password');
  }
  get password() {
    return this.formResetPassword.get('password');
  }
  get password_confirmation() {
    return this.formResetPassword.get('password_confirmation');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
