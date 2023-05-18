import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/modules/user/service/user.service';
import { EditUserProfile } from 'src/app/models/receive/edit-user-profile';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { UserPreferences } from 'src/app/models/user-preferences';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss', '../../../../styles/user-form.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public error: string;
  public loading: boolean;
  public user: EditUserProfile;
  public preferences: UserPreferences;
  public userId: number;
  public filesToUpload: Array<File>;
  public imageSelected: string;
  public imageSrc: string;
  public url: string;
  public formEditProfile: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public userDeletion: number;
  public deleteLoading: boolean;
  public deletionPassword: string;
  public deletionPassword2: string;
  public sending: boolean;
  public validationMessagesEditProfile = {
    nick: {
      required: '',
      minlength: '',
      maxlength: '',
    },
    email: {
      required: '',
      minlength: '',
      maxlength: '',
      email: '',
    },
    location: {
      minlength: '',
      maxlength: '',
    },
    birthday: {
      minlength: '',
      maxlength: '',
    },
    avatar: {
      minlength: '',
      maxlength: '',
    },
  };
  public formEditPreferences: FormGroup;
  public view: boolean;

  constructor(
    private userService: UserService,
    private _authService: AuthService,
    private themeService: ThemeService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private _translateService: TranslateService

  ) {
    this.sending = false;
    this.deletionPassword = '';
    this.deletionPassword2 = '';
    this.deleteLoading = false;
    this.userDeletion = 0;
    this.unsubscribe$ = new Subject();
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.loading = true;
    this.validationMessagesEditProfile = {
      nick: {
        required: this._translateService.instant("VALIDATION.NICK.REQUIRED"),
        minlength: this._translateService.instant("VALIDATION.NICK.MIN"),
        maxlength: this._translateService.instant("VALIDATION.NICK.MAX"),
      },
      email: {
        required: this._translateService.instant("VALIDATION.EMAIL.REQUIRED"),
        minlength: this._translateService.instant("VALIDATION.EMAIL.MIN"),
        maxlength: this._translateService.instant("VALIDATION.EMAIL.MAX"),
        email: this._translateService.instant("VALIDATION.EMAIL.EMAIL"),
      },
      location: {
        minlength: this._translateService.instant("VALIDATION.LOCATION.MIN"),
        maxlength: this._translateService.instant("VALIDATION.LOCATION.MAX"),
      },
      birthday: {
        minlength: this._translateService.instant("VALIDATION.BIRTHDAY.MIN"),
        maxlength: this._translateService.instant("VALIDATION.BIRTHDAY.MAX"),
      },
      avatar: {
        minlength: this._translateService.instant("VALIDATION.AVATAR.MIN"),
        maxlength: this._translateService.instant("VALIDATION.AVATAR.MAX"),
      },
    }
    this.user = {
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
    };
    this.preferences = {
      sidebar: true,
      filter_bad_words: false,
      allow_view_profile: true,
      allow_user_to_mp: true,
      hide_email: false,
      language: 'es',
      allow_music: true,
      recieve_emails: true,
    };
    this.userId = this._authService.user?.userData.id;
    this.filesToUpload = [];
    this.imageSelected = '';
    this.imageSrc = '';
    this.url = environment.api + 'user/';
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
      location: [null, [Validators.minLength(3), Validators.maxLength(64)]],
      birthday: [null, [Validators.minLength(3), Validators.maxLength(64)]],
      avatar: [null, []],
      deleteAvatar: [false, []],
    });
    this.formEditPreferences = this.formBuilderNonNullable.group({
      sidebar: [true, []],
      filter_bad_words: [true, []],
      allow_view_profile: [true, []],
      allow_user_to_mp: [true, []],
      language:[''],
      hide_email: [false, []],
      allow_music: [true, []],
      recieve_emails: [true, []],
    });
    this.view = true;
  }

  ngOnInit(): void {
    this.userService.getEdit().subscribe({
      next: (res) => {
        this.loading = false;
        this.user = res;
      },
      error: (err) => {
        this.loading = false;
      },
    });

    this.getPref();
    
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t: string) => {
        this.theme = t;
      });
  }

  submit(): void {
    this.sending = true;
    if (this.formEditProfile.valid) {
      this.error = '';
      delete this.formEditProfile.value.avatar;
      // Miro si vol canviar l'imatge o no
      if (this.filesToUpload.length == 0 || this.deleteAvatar?.value) {
        this.userService
          .editProfile(this.formEditProfile.value)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (res) => {
              this.sending = false;
              this._authService.autoAuthUser();
              this.toastService.show(this._translateService.instant(res.message));
            },
            error: (err) => {
              this.sending = false;
              this.error = err.error.message;
            },
          });
      } else {
        this.userService
          .editProfileWithImage(this.formEditProfile.value, this.filesToUpload)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (res) => {
              this.sending = false;
              this.toastService.show(this._translateService.instant(res.message));
              this._authService.autoAuthUser();
            },
            error: (err) => {
              this.sending = false;
              this.error = err.error.message;
            },
          });
      }
    } else {
      this.error = this._translateService.instant("VALIDATION.WRONG_FORMDATA");
    }
  }

  //* Detecta quan es selecciona una imatge i l'afagei a la variables filesToUpload
  fileChangeEvent(fileInput: any): void {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  //* Mostra la imatge seleccionada
  readURL(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.imageSelected = event.target.files[0].name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  toggleView(): void {
    this.view = !this.view;
  }

  getPref(): void {
    this.userService
      .getPreferences()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.preferences = res;
        },
        error: () => {
        },
      });
  }

  editPreferences(): void {
    this.sending = true;
    if (this.formEditPreferences.valid) {
      this.userService
        .editPreferences(this.preferences)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.sending = false;
            localStorage.setItem('lang', this.preferences.language);
            this._translateService.use(this.preferences.language);
            this._authService.autoAuthUser();
            this.toastService.show(this._translateService.instant(res.message));
          },
          error: () => {
            this.sending = false;
            this._authService.autoAuthUser();
          },
        });
    } else {
      this.error = this._translateService.instant('VALIDATION.WRONG_FORMDATA');
    }
  }

  deleteUser(modal: any) {
    this.deletionPassword = '';
    this.deletionPassword2 = '';
   
    this.modalService.open(modal).result.catch(() => {
      if (this.userDeletion != 3) {
        this.toastService.show(this._translateService.instant('DESTRUCTION_ABORTED'));
      }
      this.userDeletion = 0;
      this.deletionPassword = '';
      this.deletionPassword2 = '';
    });
  }

  confirmDelete() {
    this.userDeletion++;
    if (this.userDeletion >= 3) {
      this.deleteLoading = true;
      if (
        this.deletionPassword !== this.deletionPassword2 ||
        this.deletionPassword === ''
      ) {
        this.modalService.dismissAll();
        this.deleteLoading = false;
        this.toastService.show(this._translateService.instant('DESTRUCTION_FAILED_MISMATCH'));
      } else {
        this.userService
          .dropUser(this.deletionPassword, this.deletionPassword2)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (r) => {
              this.modalService.dismissAll();
              this.deleteLoading = false;
              this.toastService.show(this._translateService.instant(r.message));
              window.location.href = '/';
            },
            error: (e) => {
              this.deleteLoading = false;
              this.modalService.dismissAll();
              this.toastService.show(
                this._translateService.instant('User destruction failed: ') + this._translateService.instant(e.error.message)
              );
            },
          });
      }
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
  get deleteAvatar() {
    return this.formEditProfile.get('deleteAvatar');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
