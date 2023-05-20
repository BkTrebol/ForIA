import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { PublicRole, Role } from 'src/app/models/receive/admin-role';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  private _userId: number;
  public editUserForm: FormGroup;
  public loading: boolean;
  public roleList: Array<Role>;
  public publicRoleList: Array<PublicRole>;
  public user: any;
  public dateToday: NgbDateStruct;
  public nickUnique: number | null;
  public emailUnique: number | null;
  public saveLoading: boolean;
  public deleteLoading: boolean;
  public userDeletion: number;
  public passToggle: boolean;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private _toastService: ToastService,
    private _modalService: NgbModal,
    private _router: Router,
    private _authService: AuthService
  ) {
    const dateNow = new Date();
    this.dateToday = {
      year: dateNow.getFullYear(),
      month: dateNow.getMonth() + 1,
      day: dateNow.getDate(),
    };
    this.userDeletion = 0;
    this.deleteLoading = false;
    this.saveLoading = false;
    this.nickUnique = NaN;
    this.emailUnique = NaN;
    this._userId = 0;
    this.unsubscribe$ = new Subject();
    this.roleList = [];
    this.publicRoleList = [];
    this.loading = true;
    this.editUserForm = this.fb.group({
      nick: [],
      email: [],
      email_verified_at: [],
      password: [null],
      location: [],
      birthday: [],
      public_role_id: [],
      avatar: [],
      rol: [],
      suspension: [],
      roles: [],
    });
    this.passToggle = true;
  }

  ngOnInit() {
    this._userId = this._route.snapshot.params['id'];
    this.getData();
    this.getRoles();
    this.getPublicRoles();
  }

  getData() {
    this.loading = true;
    this._userService
      .getUser(this._userId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.loading = false;
          this.user = r;
          this.populateForm();
        },
      });
  }

  populateForm() {
    const userRoles = this.user.roles.map((role: any) => role.id);
    this.editUserForm = this.fb.group({
      id: [this.user.id],
      nick: [this.user.nick, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      email_verified_at: [this.user.verified],
      password: [null],
      location: [this.user.location],
      birthday: [this.parseDateToPicker(this.user.birthday)],
      public_role_id: [this.user.public_role_id, Validators.required],
      // avatar: [this.user.avatar],
      roles: [userRoles],
      suspension: [this.parseDateToPicker(this.user.suspension)],
    });
    // console.log(this.editUserForm.value);
  }

  parseDateToPicker(date: any) {
    if (date === null) {
      return null;
    }
    const dateToParse = new Date(date);
    return {
      year: dateToParse.getFullYear(),
      month: dateToParse.getMonth() + 1,
      day: dateToParse.getDate(),
    };
  }

  parsePickerDate(date: any) {
    if (date === null) {
      return null;
    }
    return `${date.year}/${date.month}/${date.day}`;
  }

  deleteUser(modal: any) {
    this._modalService.open(modal).result.finally(() => {
      this.userDeletion = 0;
    });
  }

  confirmDelete() {
    this.userDeletion++;
    if (this.userDeletion >= 3) {
      this.deleteLoading = true;
      this._userService
        .dropUser(this.user.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (r) => {
            this._modalService.dismissAll();
            this.deleteLoading = false;
            this._toastService.show(r.message);
            if (this.user.id === this._authService.user.userData.id) {
              window.location.href = '/';
            } else {
              this._router.navigate(['/admin/users']);
            }
          },
          error: () => {
            this.deleteLoading = false;
          },
        });
    }
  }

  getRoles() {
    this._userService
      .getRoles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.roleList = r;
        },
      });
  }

  getPublicRoles() {
    this._userService
      .getPublicRoles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.publicRoleList = r;
        },
      });
  }

  checkNick() {
    if (this.nick?.valid && this.nick?.value !== this.user.nick) {
      this._userService
        .checkNick(this.nick.value, this.user.nick)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((r) => {
          if (r !== false) {
            this.nickUnique = r;
            this.nick?.setErrors({});
          }
        });
    }
  }

  checkEmail() {
    if (this.email?.valid && this.email.value !== this.user.email) {
      this._userService
        .checkEmail(this.email.value, this.user.email)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((r) => {
          if (r !== false) {
            this.emailUnique = r;
            this.email?.setErrors({ unique: true });
          }
        });
    }
  }

  onSubmit() {
    this.saveLoading = true;
    // console.log(this.editUserForm.value);
    if (this.editUserForm.valid) {
      this.editUserForm.value.birthday = this.parsePickerDate(
        this.editUserForm.value.birthday
      );
      this.editUserForm.value.suspension = this.parsePickerDate(
        this.editUserForm.value.suspension
      );
      if (this.editUserForm.value.email_verified_at !== this.user.verified) {
        this.editUserForm.value.verified =
          this.editUserForm.value.email_verified_at;
      }
      // console.log(this.editUserForm.value);
      this._userService
        .updateUser(this.editUserForm.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((r) => {
          this.saveLoading = false;
          this.user = r.user;
          this.populateForm();
          this._toastService.show(r.message);
        });
    }
  }

  focusDateInput(inputElement: HTMLElement) {
    inputElement.focus();
  }

  get nick() {
    return this.editUserForm.get('nick');
  }
  get email() {
    return this.editUserForm.get('email');
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
