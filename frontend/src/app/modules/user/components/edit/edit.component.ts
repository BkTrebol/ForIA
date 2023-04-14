import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/modules/user/service/user.service';
import { EditUserProfile } from 'src/app/models/receive/edit-user-profile';
import { Global } from 'src/app/environment/global';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss', '../../../../styles/user-form.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public error: string;
  public loading: boolean;
  public user: EditUserProfile;
  public filesToUpload: Array<File>;
  public imageSelected: string;
  public imageSrc: string;
  public url: string;
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

  constructor(
    private userService: UserService,
    private _authService: AuthService,
    private router: Router,
    public route: ActivatedRoute
  ) {
    this.unsubscribe$ = new Subject();
    this.error = '';
    this.loading = true;
    this.user = {
      nick: '',
      email: '',
      location: '',
      birthday: '',
      avatar: '',
    };
    this.filesToUpload = [];
    this.imageSelected = '';
    this.imageSrc = '';
    this.url = Global.api + 'user/';
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
  }

  ngOnInit() {
    if (this.route.snapshot.data['response']) {
      this.user = this.route.snapshot.data['response'];
      this.loading = false;
    } else {
      this.loading = false;
      this.router.navigate(['/user/profile']);
    }
  }

  submit(): void {
    if (this.formEditProfile.valid) {
      this.loading = true;
      this.error = '';
      delete this.formEditProfile.value.avatar;
      // Miro is vol canviar l'imatge o no
      if (this.filesToUpload.length == 0 || this.deleteAvatar?.value) {
        this.userService
          .editProfile(this.formEditProfile.value)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (res) => {
              this.loading = false;
              this.router.navigate(['/user/profile']);
              this._authService.autoAuthUser();
            },
            error: (err) => {
              this.loading = false;
              this.error = err.error.message;
            },
          });
      } else {
        this.userService
          .editProfileWithImage(this.formEditProfile.value, this.filesToUpload)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (res) => {
              this.loading = false;
              this.router.navigate(['/user/profile']);
              this._authService.autoAuthUser();
            },
            error: (err) => {
              this.loading = false;
              this.error = err.error.message;
            },
          });
      }
    } else {
      this.error = 'Invalid data in the Form';
    }
  }

  //* Detecta quan es selecciona una imatge i l'afagei a la variables filesToUpload
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  //* Mostra la imatge seleccionada
  readURL(event: any) {
    // console.log(event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      this.imageSelected = event.target.files[0].name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
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
