import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../service/user.service';
import { CdkDragDrop,moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent {
  private unsubscribe$: Subject<void>;
  public loading:boolean;
  public roleList:Array<any>;
  public orderedRoleList:Array<any>;
  public publicRoleList:Array<any>;

  constructor(
    private _userService: UserService
  ){
    this.unsubscribe$ = new Subject();
    this.roleList = [];
    this.orderedRoleList = [];
    this.publicRoleList = [];
    this.loading = true;

  }

  ngOnInit() {
    this.getRoles();
    this.getPublicRoles();
    this.loading = false;
  }
  
  getRoles(){
    this._userService.getRoles()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r => {
        this.roleList = r;
      }
    })
  }
  getPublicRoles(){
    this._userService.getPublicRoles()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r => {
        this.publicRoleList = r;
      }
    });
  }

  onItemDropped(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.roleList, event.previousIndex, event.currentIndex);
  }
}
