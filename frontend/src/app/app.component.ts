import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { User } from './models/user';
import { UserPreferences } from './models/user-preferences';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './styles/general.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public userIsAuthenticated: {userData:User,userPreferences:UserPreferences} | null;

  top: boolean;
  canSmall: boolean;

  constructor(private _authService: AuthService, private router: Router) {
    this.unsubscribe$ = new Subject();
    this.userIsAuthenticated = null;
    this.top = false;
    this.canSmall = false;
    this._authService.autoAuthUser();

  }

  ngOnInit() {
    this._authService.userData
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(r =>{
      this.userIsAuthenticated = r
    })
    // this.userIsAuthenticated = this._authService.getIsAuth();
    // this._authService
    //   .getAuthStatusListener()
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((isAuthenticated) => {
    //     this.userIsAuthenticated = isAuthenticated;
    //   });
    // this._authService.autoAuthUser();

    // Function that change the nav height on scroll
    this.small();
    // Only in some pages
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          [
            '/auth/login',
            '/auth/register',
            '/auth/reset-password',
            '/user/edit',
            '/user/preferences',
          ].includes(event.url)
        ) {
          // console.log(event.url);
          this.canSmall = false;
        } else {
          this.canSmall = true;
        }
      }
    });
  }

  // For changing the nav height on scroll
  small() {
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

  // Logout the user
  logout() {
    this._authService.logout();
    // this._authService
    //   .getAuthStatusListener()
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe({
    //     next: (res) => {
    //       this.router.navigate(['/']);
    //     },
    //     error: (err) => {
    //       this.router.navigate(['/']);
    //     },
    //   });
  }

  ngOnDestroy(): void {
    // this._authService.unsubscribeAutoAuthUser();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
