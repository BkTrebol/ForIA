import { Component, HostBinding, OnInit } from '@angular/core';
import { Subject, take, takeUntil } from 'rxjs';
import { SidebarService } from 'src/app/helpers/services/sidebar.service';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  private unsubscribe$:Subject<void>;
  public theme:string;
  public userData:any;
  public userLocalData:any;
  public userLoggedIn:boolean;
  public lastPosts:Array<any>;

  @HostBinding('style.order') order = 0;
  constructor(
    private authService:AuthService,
    private themeService:ThemeService,
    private sidebarService:SidebarService
  ){
    this.lastPosts = [];
    this.userLoggedIn = false;
    this.unsubscribe$ = new Subject();
    this.theme = themeService.getTheme();
  }

  ngOnInit(): void {
    this.authService.authData
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r => {
        this.userLoggedIn = r != null;
        this.userLocalData = r?.userData;
        this.order = r?.userPreferences.sidebar ? 0 : 1;
        console.log(this.order)
      }
    })

    this.sidebarService.getData()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (r:any) => this.userData = r,
    });

    this.sidebarService.getPosts()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (r:any) => this.lastPosts = r,
    });
    this.themeService.theme
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((t) => {
      this.theme = t;
    });
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
