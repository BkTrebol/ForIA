import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './components/styles/general.scss'],
})
export class AppComponent implements OnInit {
  userIsAuthenticated: boolean;
  private authListenerSubs!: Subscription;

  top: boolean = false;
  canSmall: boolean = false;

  constructor(private _authService: AuthService, private router: Router) {
    this.userIsAuthenticated = false; //serivce
  }

  ngOnInit() {
    this.userIsAuthenticated = this._authService.getIsAuth();
    this.authListenerSubs = this._authService
      .getAuthStatusListener() //.pipe(takeUntil)
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });

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
    console.log('Logout (app.component)');
    this._authService.logout();
  }
}
