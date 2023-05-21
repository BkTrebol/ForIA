import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { UserService } from '../../service/user.service';
import { Subject, takeUntil } from 'rxjs';
import { Role } from 'src/app/models/receive/admin-role';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public tableLoading: boolean;
  public tableData: any;
  public roleList: Array<Role>;
  public show: {
    email: boolean;
    lastSeen: boolean;
    createdAt: boolean;
    posts: boolean;
    avatar: boolean;
  };
  public filters: {
    page?: number;
    order?: string;
    dir?: 'asc' | 'desc';
    nick?: string;
    verified?: boolean;
    suspension?: boolean;
    google?: boolean;
    roles?: Array<number>;
    rolesAll?: boolean;
  };

  constructor(private _userService: UserService) {
    this.show = {
      email: true,
      lastSeen: true,
      createdAt: true,
      posts: true,
      avatar: true
    };

    this.tableLoading = true;
    this.unsubscribe$ = new Subject();
    this.roleList = [];
    this.filters = {
      page: 1,
    };
    this.loading = true;
    this.tableData = [];
  }

  ngOnInit() {
    this.getData();
    this.getRoles();
    this.updateColumnVisibility();
  }

  updateColumnVisibility() {
    this.show = {
      email: window.innerWidth >= 500,
      lastSeen: window.innerWidth >= 668,
      createdAt: window.innerWidth >= 900,
      posts: window.innerWidth >= 500,
      avatar: window.innerWidth >= 1100,
    };
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateColumnVisibility();
  }

  getData() {
    this.tableLoading = true;
    const parsedFilters = this.parseFilters();
    this._userService
      .getList(parsedFilters)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.loading = false;
          this.tableLoading = false;
          this.tableData = r;
        },
      });
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

  onChangePage(event: any) {
    this.filters.page = event.offset + 1;
    this.getData();
  }

  onSort(event: any) {
    this.filters.order = event.sorts[0].prop;
    this.filters.dir = event.sorts[0].dir;
    this.getData();
  }

  onFilter() {
    this.getData();
  }

  parseFilters() {
    const params = new URLSearchParams();

    Object.entries(this.filters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== 'null' &&
        value !== '' &&
        value !== 'undefined'
      ) {
        if (key === 'roles' && this.filters.roles?.length !== 0) {
          params.set(key, value.toString());
        } else if (key !== 'roles') {
          params.set(key, value.toString());
        }
      }
    });
    return params.toString() ? '?' + params.toString() : '';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
