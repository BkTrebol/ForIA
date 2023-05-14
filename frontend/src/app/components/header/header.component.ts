import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../modules/auth/service/auth.service';
import { User } from '../../models/user';
import { UserPreferences } from '../../models/user-preferences';
import { Global } from 'src/environment/global';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';

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

  public userList$: Observable<{ id: number; nick: string }[]>;
  public user: number;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {
    this.user = 0;
    this.userList$ = new Observable();
    this.unsubscribe$ = new Subject();
    this.userIsAuthenticated = null;
    this.top = false;
    this.canSmall = false;
    this.url = Global.api + 'user/get-avatar/';
    this.theme = this.themeService.getTheme();
    this.hover = false;
  }

  ngOnInit(): void {
    this.userList$ = this._authService.getUserList();

    this._authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userIsAuthenticated = r;
        if (this.userIsAuthenticated?.userData.id) {
          this.user = this.userIsAuthenticated?.userData.id;
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

  changeUser() {
    if (this.user) {
      this._authService
        .changeUser(this.user)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this._authService.autoAuthUser();
            this.toastService.show(res.message);
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
          this.toastService.show(res.message);
        },
        error: (err) => {
          this.toastService.show(err.message);
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
