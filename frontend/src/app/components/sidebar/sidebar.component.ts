import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidebarService } from 'src/app/helpers/services/sidebar.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { LastPosts } from 'src/app/models/receive/last-posts';
import { ForumStats } from 'src/app/models/receive/forum-stats';
import { UserStats } from 'src/app/models/receive/user-stats';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public userData: UserStats;
  public userLocalData: User | null;
  public userLoggedIn: boolean;
  public lastPosts: LastPosts[];
  public forumStats: ForumStats;
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
    this.userData = {
      messages: 0,
      pms: 0,
      newPms: 0,
    }
    this.userLocalData = null;
    this.forumStats = {
      topics: 0,
      posts: 0,
      users: 0,
      lastUser: {
        id: 0,
        nick: '',
      },
      lastPoll: {
        id: 0,
        name: '',
        topic_id: 0,
      },
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
        this.userLocalData = r?.userData ?? null;
        this.order = r?.userPreferences.sidebar ? 1 : 0;
        if (this.userLoggedIn) {
          this.elseLoading = true;
          this.sidebarService
            .getData()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (r: UserStats) => {
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
        next: (r: LastPosts[]) => {
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
        next: (r: ForumStats) => {
          this.forumStats = r;
          this.loading = false;
        },
      });

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t: string) => {
        this.theme = t;
      });
  }

  editSidebar() {
    this.sidebarService.editSidebar(this.order === 0 ? true : false).subscribe({
      next: () => {
        this.order = this.order ? 0 : 1;
        this.authService.autoAuthUser();
      },
      error: () => {
        //
      },
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
