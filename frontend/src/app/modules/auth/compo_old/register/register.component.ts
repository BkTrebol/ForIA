import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Register } from 'src/app/models/register';
import { AuthService } from 'src/app/services/auth/auth.service';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../../../styles/user-form.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public error: string;
  public loading: boolean;
  public user: Register;
  public formRegister: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public validationMessagesRegister = {
    nick: {
      required: 'Nick is Required',
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 100',
      repeat: 'Nick already choosen',
    },
    email: {
      required: 'Email is Required',
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 255',
      email: 'Invalid Email',
      repeat: 'Email already choosen',
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
      mismatch: "Password Confirmation don't match",
    },
  };

  constructor(
    private _authService: AuthService,
    private router: Router,
    public library: FaIconLibrary) {
      library.addIconPacks(fas, far, fab);
    this.unsubscribe$ = new Subject();
    this._authService.userData
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(r =>{
        if (r) this.router.navigate(['/']);
    })
    this.error = '';
    this.loading = false;
    this.user = {
      nick: '',
      email: '',
      password: '',
      password_confirmation: '',
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
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {
    this._authService.getCSRF();
  }

  // Register the User
  submit(): void {
    if (this.formRegister.valid) {
      this.loading = true;
      this._authService.register(this.user);
      this._authService
        .getAuthStatusListener()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.loading = false;
            this.error = '';
            this.router.navigate(['/user/profile']);
          },
          error: (err) => {
            this.loading = false;
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
            }
            if (err.error.errors.email) {
              this.formRegister.controls['email'].setErrors({ repeat: true });
            }
          },
        });
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
