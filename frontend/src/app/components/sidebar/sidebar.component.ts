import { Component, HostBinding, OnInit } from '@angular/core';
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
export class SidebarComponent implements OnInit {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public userData: any;
  public userLocalData: any;
  public userLoggedIn: boolean;
  public lastPosts: Array<any>;
  public forumStats:{topics:number, posts:number,users:number,lastUser:any}
  public loginForm: FormGroup;
  public authData:AuthData;

  @HostBinding('style.order') order = 0;
  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private sidebarService: SidebarService
  ) {
    this.forumStats = {topics:0, posts:0,users:0,lastUser:{}};
    this.lastPosts = [];
    this.userLoggedIn = false;
    this.unsubscribe$ = new Subject();
    this.theme = themeService.getTheme();
    this.authData = { email: '', password: '', remember_me: false };
    this.loginForm = new FormGroup({
      email: new FormControl('',
      [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.email]
      ),
      password: new FormControl('',Validators.required),
      remember_me : new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userLoggedIn = r != null;
        this.userLocalData = r?.userData;
        console.log(r)
        this.order = r?.userPreferences.sidebar ? 1 : 0;
        // console.log(this.order);
      },
    });

    this.sidebarService
      .getData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r: any) => (this.userData = r),
      });

    this.sidebarService
      .getPosts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r: any) => (this.lastPosts = r),
      });

      this.sidebarService
      .getForumStats()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r: any) => {console.log(r);this.forumStats = r},
      })

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  onLogin(){
    this.authService.login(this.authData)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r => console.log(r),
      error: e => console.log(e),
    })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
