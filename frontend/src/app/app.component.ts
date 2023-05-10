import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';
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
import { ToastService } from './helpers/services/toast.service';
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
  public isAdminRoute:boolean;
  constructor(
    private _authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private cdRef: ChangeDetectorRef,
    private toastService: ToastService,
  ) {
    this.unsubscribe$ = new Subject();
    this.userIsAuthenticated = null;
    this.loading = true;
    this._authService.autoAuthUser();
    this.theme = themeService.getTheme();
    this.isAdminRoute = false;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAdminRoute = event.url.startsWith('/admin');
        if(event instanceof NavigationEnd && event.url.startsWith('/admin')){
          this.loading = false;
        }
        if (event instanceof NavigationStart && event.url.startsWith('/admin')) {
          this.loading = true;
        }
      });
  }

  ngOnInit() {
    this._authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userIsAuthenticated = r;

        if (this.userIsAuthenticated && !this.userIsAuthenticated.userData.isVerified) {
          this.toastService.show('Verify your email')
        }
      },
    });

    // Change the loading
    this._authService.loading$.subscribe({
      complete: () => {
        this.loading = false;
        // this.cdRef.detectChanges();
        // setTimeout(() => this.loading = false);
        // this.loadingRoutes();
      },
    });

    // Set Theme
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  loadingRoutes(): void {
    //Loading Page
    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe((event) => {
      if (
        event instanceof GuardsCheckStart ||
        event instanceof NavigationStart ||
        event instanceof ResolveStart ||
        event instanceof ChildActivationStart ||
        event instanceof ActivationStart
      ) {
        this.loading = true;
      }
      if (
        event instanceof GuardsCheckEnd ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof ResolveEnd ||
        event instanceof ChildActivationEnd ||
        event instanceof ActivationEnd
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
