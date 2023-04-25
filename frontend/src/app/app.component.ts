import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  ActivationEnd,
  ActivationStart,
  ChildActivationEnd,
  ChildActivationStart,
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
import { ThemeService } from 'src/app/helpers/services/theme.service';
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
  public theme: string;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.unsubscribe$ = new Subject();
    this.userIsAuthenticated = null;
    this.loading = true;
    this._authService.autoAuthUser();
    this.theme = themeService.getTheme();
  }

  ngOnInit() {
    this._authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (res) => {
        console.log('res', res);
        this.userIsAuthenticated = res;
        this._authService.loading$.subscribe({
          complete: () => {
            this.loading = false;
            console.log('acabao illo');
          },
        });
      },
      error: (err) => {
        console.log('err', err);
        this._authService.loading$.subscribe({
          complete: () => {
            this.loading = false;
            console.log('acabao2 illo');
          },
        });
      },
      complete: () => {
        console.log("Complete");
        this._authService.loading$.subscribe({
          complete: () => {
            this.loading = false;
            console.log('acabao2 illo');
          },
        });
      },
      // complete: () => {
      //   setTimeout(() => {
      //     this.loading = false;
      //   }, 100);
      // },
    });

    // Loading Page
    // this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
    //   if (
    //     event instanceof GuardsCheckStart ||
    //     event instanceof NavigationStart ||
    //     event instanceof ResolveStart ||
    //     event instanceof ChildActivationStart ||
    //     event instanceof ActivationStart
    //   ) {
    //     this.loading = true;
    //   }
    //   if (
    //     event instanceof GuardsCheckEnd ||
    //     event instanceof NavigationEnd ||
    //     event instanceof NavigationCancel ||
    //     event instanceof NavigationError ||
    //     event instanceof ResolveEnd ||
    //     event instanceof ChildActivationEnd ||
    //     event instanceof ActivationEnd
    //   ) {
    //     this.loading = false;
    //   }
    // });

    // Set Theme
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
