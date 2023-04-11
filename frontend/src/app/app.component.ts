import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
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
    this.loading = false;
    this._authService.autoAuthUser();
  }

  ngOnInit() {
    this._authService.authData
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((r) => {
        this.userIsAuthenticated = r;
      });

    // Loading Page
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
      if (
        event instanceof GuardsCheckStart ||
        event instanceof NavigationStart ||
        event instanceof ResolveStart
      ) {
        this.loading = true;
      }
      if (
        event instanceof GuardsCheckEnd ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof ResolveEnd
      ) {
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
