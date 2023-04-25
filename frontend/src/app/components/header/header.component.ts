import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../modules/auth/service/auth.service';
import { User } from '../../models/user';
import { UserPreferences } from '../../models/user-preferences';
import { Global } from 'src/app/environment/global';
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

  public userList$: Observable<any>;
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

  ngOnInit(): void {
    this.userList$ = this._authService.getUserList();

    this._authService.authData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        this.userIsAuthenticated = r;
        if (this.userIsAuthenticated?.userData.id) {
          this.user = this.userIsAuthenticated?.userData.id;
          this._authService.completeLoad();
        }
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
          '/user/profile',
        ].includes(this.router.url)
      ) {
        this.canSmall = false;
      } else {
        this.canSmall = true;
      }
    });

    // Set default theme
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
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
    // this.toastService.showDanger('Holita');
    this.theme = this.theme == 'dark' ? 'light' : 'dark';
    this.themeService.changeTheme(this.theme);
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
