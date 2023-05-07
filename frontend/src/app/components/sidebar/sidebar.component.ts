import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SidebarService } from 'src/app/helpers/services/sidebar.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { AuthData } from 'src/app/models/auth-data';
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
  public loginForm: FormGroup;
  public authData: AuthData;
  public loading: boolean[];

  @HostBinding('style.order') order = 0;
  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private sidebarService: SidebarService
  ) {
    this.unsubscribe$ = new Subject();
    this.forumStats = { topics: 0, posts: 0, users: 0, lastUser: {},lastPoll:{} };
    this.lastPosts = [];
    this.userLoggedIn = false;
    this.theme = themeService.getTheme();
    this.authData = { email: '', password: '', remember_me: false };
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
        Validators.email,
      ]),
      password: new FormControl('', Validators.required),
      remember_me: new FormControl(null),
    });
    this.loading = [true, true, true, true, true];
  }

  ngOnInit(): void {
    this.authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userLoggedIn = r != null;
        this.userLocalData = r?.userData;
        this.order = r?.userPreferences.sidebar ? 1 : 0;
        this.loading[0] = false;
        if (this.userLoggedIn) {
          this.sidebarService
            .getData()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (r: any) => {
                this.userData = r;
                this.loading[1] = false;
              },
            });
        }
      },
      error: (err) => {
        this.loading[0] = false;
      },
    });

    this.sidebarService
      .getPosts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r: Array<any>) => {
          this.lastPosts = r;
          this.loading[2] = false;
        },
      });

    this.sidebarService
      .getForumStats()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r: any) => {
          this.forumStats = r;
          this.loading[3] = false;
        },
      });

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
