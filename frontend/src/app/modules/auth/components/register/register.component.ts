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
      mismatch: 'Password confirmation mismatch',
    },
    terms: {
      required: 'Pleas Accept Terms and conditions',
    },
  };
  public termsText: string;

  constructor(
    private modalService: NgbModal,
    private _authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService
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
            Validators.pattern('^[a-zA-Z0-9_+-]+$'), // TODO change pattern
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
    this.termsText = `
Welcome to our forum web page! These terms and conditions (“Terms”) govern your use of this web page and any content, features, or services offered on it. By accessing or using this web page, you agree to be bound by these Terms. If you do not agree to be bound by all of these Terms, do not access or use this web page.
<br><br>
1. User Conduct<br><br>
You agree to use this web page only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of this web page by, any third party. Prohibited behavior includes, but is not limited to:
<br><br>
Posting or transmitting any unlawful, threatening, abusive, libelous, defamatory, obscene, vulgar, pornographic, profane, or indecent information of any kind, including without limitation any transmissions constituting or encouraging conduct that would constitute a criminal offense, give rise to civil liability, or otherwise violate any applicable law.
Posting or transmitting any information or software that contains a virus, worm, Trojan horse, or other harmful or disruptive component.
Impersonating any person or entity, or falsely stating or otherwise misrepresenting your affiliation with a person or entity.
Posting or transmitting any unsolicited advertising, promotional materials, or any other forms of solicitation.
Collecting or storing personal data about other users.
<br><br>
2. Content Submission<br><br>
You are solely responsible for any information, data, text, software, music, sound, photographs, graphics, video, messages, tags, or other materials (“Content”) that you submit, upload, or otherwise make available on this web page. You agree that you will not submit Content that:
<br><br>
Infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party.
You do not have the right to make available under any law or under contractual or fiduciary relationships.
Is harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another’s privacy, or otherwise objectionable.
By submitting Content, you grant us a worldwide, non-exclusive, perpetual, irrevocable, royalty-free, fully paid, sublicensable, and transferable license to use, reproduce, distribute, modify, adapt, prepare derivative works of, display, perform, and otherwise exploit the Content in connection with this web page and our business.
<br><br>
3. Moderation and Termination<br><br>
We reserve the right to moderate or terminate access to this web page, without notice or liability, for any reason, including but not limited to a breach of these Terms. We also reserve the right to remove any Content posted on this web page that we deem inappropriate or objectionable.
<br><br>
4. Disclaimer of Warranties<br><br>
This web page is provided on an “as is” and “as available” basis. We do not make any representations or warranties of any kind, express or implied, regarding the operation or availability of this web page or the information, Content, materials, or products included on it. To the fullest extent permitted by applicable law, we disclaim all warranties, express or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose.
<br><br>
5. Limitation of Liability<br><br>
To the fullest extent permitted by applicable law, we will not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of this web page or these Terms, even if we have been advised of the possibility of such damages. Our total liability to you for any claim arising out of or in connection with your use of this web page or these Terms will not exceed the amount paid by you, if any, to access this web page.
<br><br>
6. Indemnification<br><br>
You agree to indemnify, defend, and hold us harmless from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys’ fees) arising out of or in connection with your use of this web page, your breach of these Terms, or your violation of any applicable law or the rights of any third party.
<br><br>
7. Governing Law and Dispute Resolution<br><br>
These Terms and your use of this web page will be governed by and construed in accordance with the laws of the jurisdiction in which we are located, without giving effect to any choice or conflict of law provision or rule. Any dispute arising out of or in connection with these Terms or your use of this web page will be resolved through binding arbitration, in accordance with the rules of the arbitration association in the jurisdiction in which we are located. The arbitration will be conducted in English and will be held in the jurisdiction in which we are located. Any award rendered in such arbitration will be final and binding, and judgment may be entered upon it in accordance with applicable law in any court having jurisdiction thereof.
<br><br>
8. Miscellaneous<br><br>
These Terms constitute the entire agreement between you and us regarding your use of this web page and supersede all prior or contemporaneous communications and proposals, whether oral, written, or electronic, between you and us. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect. Our failure to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision. We may assign our rights and obligations under these Terms to any party at any time without notice to you.
<br><br>
By accessing or using this web page, you acknowledge that you have read these Terms, understand them, and agree to be bound by them.`;
  }

  ngOnInit() {
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
      this._authService
        .register(this.user)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.error = '';
            this.loading = false;
            this.router.navigate(['/']);
            this.toastService.show(res.message);
          },
          error: (err) => {
            console.log(err);
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
      this.error = 'Invalid data in the Form';
    }
  }

  changeShow() {
    this.canShow = !this.canShow;
  }

  changeShowConf() {
    this.canShowConf = !this.canShowConf;
  }

  openTermsModal(modal: any) {
    this.modalService.open(modal, { centered: true });
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
