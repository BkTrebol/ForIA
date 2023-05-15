import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../modules/auth/service/auth.service';
import { User } from '../../models/user';
import { UserPreferences } from '../../models/user-preferences';
import { environment } from 'src/environments/environment';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { Role } from 'src/app/models/receive/admin-role';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../../styles/general.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public userIsAuthenticated: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public top: boolean;
  public canSmall: boolean;
  public url: string;
  public theme: string;
  public hover: boolean;
  public roleList: Role[];
  public isAdmin: boolean;
  public userList$: Observable<{ id: number; nick: string }[]> | null;
  public user: number;
  public roles: number[];
  public development: boolean;
  public language: string;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService,
    private _translateService: TranslateService
  ) {
    this.isAdmin = false;
    this.development = !environment.production;
    this.user = 0;
    this.roles = [];
    if (environment.production) {
      this.userList$ = null;
    } else {
      this.userList$ = new Observable();
    }
    this.roleList = [];
    this.unsubscribe$ = new Subject();
    this.userIsAuthenticated = null;
    this.top = false;
    this.canSmall = false;
    this.url = environment.api + 'user/get-avatar/';
    this.theme = this.themeService.getTheme();
    this.hover = false;
    this.language = navigator.language;
  }

  ngOnInit(): void {
    if (!environment.production) {
      this.userList$ = this._authService.getUserList();
    }

    this.getRoleList();

    this._authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userIsAuthenticated = r;
        if (this.userIsAuthenticated?.userData.id) {
          this.user = this.userIsAuthenticated?.userData.id;
          this.isAdmin = this._authService.user.userData.isAdmin === true;
        }
      },
    });

    // Function that change the nav height on scroll
    this.small();
    // Only in some pages
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((_) => {
      if (
        [
          '/auth/login',
          '/auth/register',
          '/auth/reset-password',
          '/user/edit',
          '/error',
        ].includes(this.router.url) ||
        this.router.url.startsWith('/user/profile/')
      ) {
        this.canSmall = false;
      } else {
        this.canSmall = true;
      }
    });

    // Set default theme
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t: string) => {
        this.theme = t;
      });
  }

  // For changing the nav height on scroll
  small(): void {
    window.onscroll = () => {
      if (
        // document.body.scrollTop > 100 ||
        // document.documentElement.scrollTop > 100 ||
        // window.scrollY > 100 ||
        window.pageYOffset > 0 &&
        this.canSmall
      ) {
        this.top = true;
      } else {
        this.top = false;
      }
    };
  }

  // Change the Theme
  changeTheme(): void {
    this.theme = this.theme == 'dark' ? 'light' : 'dark';
    this.themeService.changeTheme(this.theme);
  }

  // Change Language (for not logged users)
  changeLanguage(): void {
    console.log("change language", this.language);
    this._translateService.use(this.language);
  }

  getRoleList() {
    this._authService
      .getRoleList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        this.roleList = r.roles;
        this.roles = r.actual;
      });
  }

  changeRole() {
    if (this.user && this.isAdmin) {
      this._authService
        .changeRole(this.roles)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this._authService.autoAuthUser();
            this.toastService.show(this._translateService.instant(res.message));
          },
          error: (e) => console.log(e),
        });
    }
  }

  changeUser() {
    if (environment.production) {
      return;
    }
    if (this.user) {
      this._authService
        .changeUser(this.user)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this._authService.autoAuthUser();
            this.toastService.show(this._translateService.instant(res.message));
          },
          error: (e) => console.log(e),
        });
    }
  }

  // Logout the user
  logout(): void {
    this._authService
      .logout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.toastService.show(this._translateService.instant(res.message));
        },
        error: (err) => {
          this.toastService.show(this._translateService.instant(err.message));
        },
        complete: () => {
          this.router.navigate(['/']);
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
