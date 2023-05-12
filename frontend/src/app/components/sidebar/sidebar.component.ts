import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidebarService } from 'src/app/helpers/services/sidebar.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public userData: any;
  public userLocalData: any;
  public userLoggedIn: boolean;
  public lastPosts: Array<any>;
  public forumStats: {
    topics: number;
    posts: number;
    users: number;
    lastUser: any;
    lastPoll: any;
  };
  public loading: boolean;
  public coll: boolean;
  public lastPostToggle: boolean;
  public statsToggle: boolean;
  public elseLoading: boolean;

  @HostBinding('style.order') order = 0;
  @HostBinding('style.width') width = '240px';
  @HostBinding('style.margin') margin = '0 1rem';
  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private sidebarService: SidebarService
  ) {
    this.unsubscribe$ = new Subject();
    this.forumStats = {
      topics: 0,
      posts: 0,
      users: 0,
      lastUser: {},
      lastPoll: {},
    };
    this.lastPosts = [];
    this.userLoggedIn = false;
    this.theme = themeService.getTheme();
    this.loading = true;
    this.coll = false;
    this.lastPostToggle = true;
    this.statsToggle = false;
    this.elseLoading = true;
  }

  ngOnInit(): void {
    this.authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userLoggedIn = r != null;
        this.userLocalData = r?.userData;
        this.order = r?.userPreferences.sidebar ? 1 : 0;
        if (this.userLoggedIn) {
          this.elseLoading = true;
          this.sidebarService
            .getData()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (r: any) => {
                this.userData = r;
              },
            });
        } else {
          this.elseLoading = false;
        }
      },
    });

    this.sidebarService
      .getPosts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r: Array<any>) => {
          this.lastPosts = r;
          setTimeout(() => {
            this.lastPostToggle = false;
          }, 100);
        },
      });

    this.sidebarService
      .getForumStats()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r: any) => {
          this.forumStats = r;
          this.loading = false;
        },
      });

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  editSidebar() {
    this.sidebarService.editSidebar(this.order === 0 ? true : false).subscribe({
      next: (res) => {
        this.order = this.order ? 0 : 1;
        this.authService.autoAuthUser();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
