import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
import { Global } from 'src/environment/global';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { UserPreferences } from 'src/app/models/user-preferences';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  public loading2: boolean;
  public user: EditUserProfile;
  public preferences: UserPreferences;
  public userId: string;
  public filesToUpload: Array<File>;
  public imageSelected: string;
  public imageSrc: string;
  public url: string;
  public formEditProfile: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public userDeletion: number;
  public deleteLoading: boolean;
  public deletionPassword:string;
  public deletionPassword2:string;
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
  public formEditPreferences: FormGroup;
  public view: boolean;

  constructor(
    private userService: UserService,
    private _authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private toastService: ToastService,
    private modalService: NgbModal
  ) {
    this.deletionPassword = "";
    this.deletionPassword2 = "";
    this.deleteLoading = false;
    this.userDeletion = 0;
    this.unsubscribe$ = new Subject();
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.loading = true;
    this.loading2 = false;
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
      hide_online_presence: false,
      two_fa: false,
      allow_music: true,
      recieve_emails: true,
    };
    this.userId = this._authService.user?.userData.id;
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
    this.formEditPreferences = this.formBuilderNonNullable.group({
      sidebar: [true, []],
      filter_bad_words: [true, []],
      allow_view_profile: [true, []],
      allow_user_to_mp: [true, []],
      hide_online_presence: [false, []],
      two_fa: [false, []],
      allow_music: [true, []],
      recieve_emails: [true, []],
    });
    this.view = true;
  }

  ngOnInit(): void {
    this.userService.getEdit().subscribe({
      next: res => {
        this.user = res
      }, error: err => {
        console.log(err);
      }, complete: () => {
        this.loading = false;
      }
    })

    this.getPref();
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  submit(): void {
    if (this.formEditProfile.valid) {
      this.loading2 = true;
      this.error = '';
      delete this.formEditProfile.value.avatar;
      // Miro si vol canviar l'imatge o no
      if (this.filesToUpload.length == 0 || this.deleteAvatar?.value) {
        this.userService
          .editProfile(this.formEditProfile.value)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (res) => {
              this._authService.autoAuthUser();
              this.toastService.show(res.message);
            },
            error: (err) => {
              this.error = err.error.message;
            },
            complete: () => {
              this.loading2 = false
            }
          });
      } else {
        this.userService
          .editProfileWithImage(this.formEditProfile.value, this.filesToUpload)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (res) => {
              this.toastService.show(res.message);
              this._authService.autoAuthUser();
            },
            error: (err) => {
              this.error = err.error.message;
            },complete: () => {
              this.loading2 = false
            }
          });
      }
    } else {
      this.error = 'Invalid data in the Form';
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
        error: (err) => {
          console.log(err);
        },
      });
  }

  editPreferences(): void {
    if (this.formEditPreferences.valid) {
      this.loading2 = true;
      this.userService
        .editPreferences(this.preferences)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this._authService.autoAuthUser();
            this.toastService.show(res.message);
          },
          error: (err) => {
            this._authService.autoAuthUser();
            console.log(err);
          },
          complete: () => {
            this.loading2 = false;
          },
        });
    } else {
      this.error = 'Invalid data in the Form';
    }
  }

  deleteUser(modal:any){
    this.deletionPassword = "";
    this.deletionPassword2 = "";
    this.modalService.open(modal).result.catch( () =>{
      if(this.userDeletion != 3){
        this.toastService.show("User destruction aborted");
      }
      this.userDeletion = 0;
      this.deletionPassword = "";
      this.deletionPassword2 = "";

    })
  }

  confirmDelete(){
    this.userDeletion++;
    if(this.userDeletion >= 3){
      this.deleteLoading = true;
      console.log(this.deletionPassword,this.deletionPassword2 )
      if(this.deletionPassword !== this.deletionPassword2 
        || this.deletionPassword === ""){
          this.modalService.dismissAll();
          this.deleteLoading = false;
          this.toastService.show("User destruction aborted: Password mismatch.");
      } else{
        this.userService.dropUser(this.deletionPassword, this.deletionPassword2)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: r => {
            console.log(r)
            this.modalService.dismissAll();
            this.deleteLoading = false;
            this.toastService.show(r.message);
            window.location.href = '/';
            
          },
          error: e => {
            this.deleteLoading = false;
            this.modalService.dismissAll();
            this.toastService.show("User destruction aborted: "+e.error.message);

          }
      })
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
