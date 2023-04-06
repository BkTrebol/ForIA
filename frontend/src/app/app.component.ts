import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  Router,
} from '@angular/router';
import { AuthService } from './modules/auth/service/auth.service';
import { User } from './models/user';
import { UserPreferences } from './models/user-preferences';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', './styles/general.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public userIsAuthenticated: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public loading: boolean;

  constructor(private _authService: AuthService, private router: Router) {
    this.unsubscribe$ = new Subject();
    this.userIsAuthenticated = null;
    this.loading = true;
    this._authService.autoAuthUser();
  }

  ngOnInit() {
    this.loading = false;
    this._authService.authData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        this.userIsAuthenticated = r;
      });

    // Loading Page
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
      if (event instanceof GuardsCheckStart) {
        this.loading = true;
        console.log('GuardStart', new Date(Date.now()));
      }
      if (
        event instanceof GuardsCheckEnd ||
        event instanceof NavigationCancel
      ) {
        this.loading = false;
        console.log('GuardEnd', new Date(Date.now()));
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
