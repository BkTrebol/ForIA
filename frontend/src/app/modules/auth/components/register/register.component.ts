import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Register } from 'src/app/models/register';
import { AuthService } from '../../service/auth.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../../../styles/user-form.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public error: string;
  public loading: boolean;
  public canShow: boolean;
  public canShowConf: boolean;
  public user: Register;
  public formRegister: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public validationMessagesRegister = {
    nick: {
      required: '',
      minlength: '',
      maxlength: '',
      repeat: 'n',
    },
    email: {
      required: '',
      minlength: '',
      maxlength: '',
      email: '',
      repeat: '',
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
    terms: {
      required: '',
    },
  };
  public sending: boolean;

  constructor(
    private modalService: NgbModal,
    private _authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService,
    private _translateService: TranslateService
  ) {
    this.unsubscribe$ = new Subject();
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.loading = false;
    this.canShow = false;
    this.canShowConf = false;
    this.user = {
      nick: '',
      email: '',
      password: '',
      password_confirmation: '',
      lang: this._translateService.currentLang
    };
    this.validationMessagesRegister = {
      nick: {
        required: _translateService.instant("VALIDATION.NICK.REQUIRED"),
        minlength: _translateService.instant("VALIDATION.NICK.MIN"),
        maxlength: _translateService.instant("VALIDATION.NICK.MAX"),
        repeat: _translateService.instant("VALIDATION.NICK.REPEAT"),
      },
      email: {
        required:  _translateService.instant("VALIDATION.EMAIL.REQUIRED"),
        minlength: _translateService.instant("VALIDATION.EMAIL.MIN"),
        maxlength: _translateService.instant("VALIDATION.EMAIL.MAX"),
        email: _translateService.instant("VALIDATION.EMAIL.EMAIL"),
        repeat:_translateService.instant("VALIDATION.EMAIL.EMAIL_REPEAT"),
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
      terms: {
        required: _translateService.instant("VALIDATION.TERMS.REQUIRED"),
      },
    };
    this.formBuilderNonNullable = new FormBuilder().nonNullable;
    this.formRegister = this.formBuilderNonNullable.group(
      {
        nick: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ],
        ],
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
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$'),
          ],
        ],
        password_confirmation: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
        terms: [false, [Validators.required]],
      },
      {
        validators: passwordMatchValidator,
      }
    );
    this.sending = false;
  }

  ngOnInit(): void {
    this._authService.authData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        if (r) this.router.navigate(['/']);
      });
    this._authService.getCSRF();
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  // Register the User
  submit() {
    if (this.formRegister.valid) {
      this.loading = true;
      this.sending = true;
      this._authService
        .register(this.user)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.error = '';
            this.loading = false;
            this.sending = false;
            this.router.navigate(['/']);
            this.toastService.show(this._translateService.instant(res.message));
          },
          error: (err) => {
            this.loading = false;
            this.sending = false;
            // Message error
            this.error = err.error.message.split('.')[0];
            // Reset the passwords
            this.formRegister.controls['password'].reset();
            // this.formRegister.controls['password'].markAsUntouched();
            this.formRegister.controls['password_confirmation'].reset();
            // this.formRegister.controls['password_confirmation'].markAsUntouched();

            // Show the errors from the backend
            if (err.error.errors.password) {
              this.formRegister.controls['password_confirmation'].setErrors({
                mismatch: true,
              });
              this.formRegister.controls[
                'password_confirmation'
              ].markAsTouched();
            }
            if (err.error.errors.nick) {
              this.formRegister.controls['nick'].setErrors({ repeat: true });
            } else {
              this.formRegister.controls['nick'].markAsTouched();
            }
            if (err.error.errors.email) {
              this.formRegister.controls['email'].setErrors({ repeat: true });
            } else {
              this.formRegister.controls['email'].markAsTouched();
            }
            if (this.formRegister.controls['terms'].value) {
              this.formRegister.controls['terms'].markAsTouched();
            }
          },
        });
    } else {
      this.error = this._translateService.instant("WRONG_FORMDATA");
    }
  }

  changeShow() {
    this.canShow = !this.canShow;
  }

  changeShowConf() {
    this.canShowConf = !this.canShowConf;
  }

  openTermsModal(modal: any) {
    this.modalService.open(modal, { centered: true, scrollable: true });
  }

  checkTerms() {
    this.formRegister.controls['terms'].setValue(true);
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
  get terms() {
    return this.formRegister.get('terms');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
