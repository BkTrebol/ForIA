import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../service/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  uniquePostsValidator,
  uniqueRoleNameValidator,
} from 'src/app/helpers/validators';
import { PublicRole, Role } from 'src/app/models/receive/admin-role';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public roleList: Array<Role>;
  public uneditableRoleList: Array<Role>;
  public orderedRoleList: Array<Role>;
  public publicRoleList: Array<PublicRole>;
  public roleType: string;
  public roleToDelete: any;
  public modalLoading: boolean;
  public saveLoading: boolean;
  public editRoleForm: FormGroup;
  public mode: string;
  public orders: Array<number>;

  constructor(
    private _userService: UserService,
    private _modalService: NgbModal,
    private _toastService: ToastService,
    private _fb: FormBuilder
  ) {
    this.mode = 'Create';
    this.orders = [];
    this.editRoleForm = this._fb.group({});
    this.unsubscribe$ = new Subject();
    this.roleList = [];
    this.uneditableRoleList = [];
    this.orderedRoleList = [];
    this.publicRoleList = [];
    this.loading = true;
    this.roleType = '';
    this.roleToDelete = '';
    this.saveLoading = false;
    this.modalLoading = false;
  }

  ngOnInit() {
    this.getRoles();
    this.getPublicRoles();
  }

  getRoles() {
    this._userService
      .getAllRoles()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.roleList = r.editable;
          this.uneditableRoleList = r.nonEditable;
          this.orders = [];
          let minRol = 3;
          let maxRol =
            r.nonEditable[0]?.order - 1 ??
            r.editable[r.editable.length - 1].order;
          for (let i = minRol; i <= maxRol; i++) {
            this.orders.push(i);
          }
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
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
        }
      });
  }

  editRole(modal: any, role: number, type: string) {
    this.roleType = type;
    this.mode = 'Edit';
    // const useRole =
    //   type === 'Public' ? this.publicRoleList[role] : this.roleList[role];
    if (type === 'Public') {
      const useRole =this.publicRoleList[role]
      this.editRoleForm = this._fb.group({
        id: [useRole.id],
        name: [
          useRole.name,
          [
            Validators.required,
            uniqueRoleNameValidator(this.publicRoleList, useRole.name),
          ],
        ],
        description: [useRole.description],
        posts: [
          useRole.posts,
          uniquePostsValidator(this.publicRoleList, useRole.posts),
        ],
      });
      if (useRole.posts === 0) {
        this.editRoleForm.get('posts')?.disable();
      }
    } else {
      const useRole = this.roleList[role];
      this.editRoleForm = this._fb.group({
        id: [useRole.id],
        name: [
          useRole.name,
          [
            Validators.required,
            uniqueRoleNameValidator(this.roleList, useRole.name),
          ],
        ],
        admin: [useRole.admin],
      });
    }

    this._modalService.open(modal).result.then(
      (r) => {
        if (r) {
          this.modalLoading = true;
          this._userService
            .editRole(this.editRoleForm.value, type)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (r) => {
                this.modalLoading = false;
                this.resetRoleVars();
                if (type === 'Public') this.getPublicRoles();
                else this.getRoles();

                this._toastService.show(r.message);
              },
              error: (e) => {
                this.modalLoading = false;
                this.resetRoleVars();
                this._toastService.show(e.message);
              },
            });
        }
      },
      () => {
        this.resetRoleVars();
      }
    );
  }

  deleteRole(modal: any, role: number, type: string) {
    this.roleType = type;
    this.roleToDelete =
      type === 'Public' ? this.publicRoleList[role] : this.roleList[role];
    this._modalService.open(modal).result.then(
      (r) => {
        if (r) {
          this.modalLoading = true;
          this._userService
            .deleteRole(this.roleToDelete.id, type)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (r) => {
                this.modalLoading = false;
                if (type === 'Public')
                  this.getPublicRoles();
                else
                  this.getRoles();
                  
                this.resetRoleVars();
                this._toastService.show(r.message);
              },
              error: (e) => {
                this.modalLoading = false;
                this.resetRoleVars();
                this._toastService.show(e.message);
              },
            });
        }
      },
      () => {
        this.resetRoleVars();
      }
    );
  }

  resetRoleVars() {
    this.roleType = '';
    this.roleToDelete = '';
    this.editRoleForm = this._fb.group({});
  }

  createRole(modal: any, type: string) {
    this.roleType = type;
    this.mode = 'Create';
    if (type === 'Public') {
      this.editRoleForm = this._fb.group({
        id: [],
        name: [
          '',
          [Validators.required, uniqueRoleNameValidator(this.publicRoleList)],
        ],
        description: [],
        posts: [null, uniquePostsValidator(this.publicRoleList)],
      });
    } else {
      this.editRoleForm = this._fb.group({
        id: [],
        name: [
          '',
          [Validators.required, uniqueRoleNameValidator(this.roleList)],
        ],
        admin: [false],
      });
    }
    this._modalService.open(modal).result.then(
      (r) => {
        if (r) {
          this.modalLoading = true;
          this._userService
            .saveRole(this.editRoleForm.value, type)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (r) => {
                this.modalLoading = false;
                this.resetRoleVars();
                if (type === 'Public') this.getPublicRoles();
                else this.getRoles();

                this._toastService.show(r.message);
              },
              error: (e) => {
                this.modalLoading = false;
                this.resetRoleVars();
                this._toastService.show(e.message);
              },
            });
        }
      },
      () => {
        this.resetRoleVars();
      }
    );
  }
  changeOrder(event: any, role: any) {
    role.order = Number(event.target.value);
  }

  saveOrder() {
    this._userService
      .saveOrder(this.roleList)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          // console.log(r);
          this.getRoles();
          this._toastService.show(r.message);
        },
        error: (e) => {
          // console.log(e);
          this._toastService.show(e.message);
        },
      });
  }

  get name() {
    return this.editRoleForm.get('name');
  }
  get posts() {
    return this.editRoleForm.get('posts');
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
