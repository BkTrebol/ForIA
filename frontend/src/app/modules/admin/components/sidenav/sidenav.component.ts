import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import {  NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { Global } from 'src/environment/global';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  private unsubscribe$: Subject<void>;
  public collapsed: boolean;
  public user: User;
  public getAvatarUrl: string;
  public defaultUrl: string;
  public avatarUrl: string;
  public regexUrl: RegExp;
  public showActive:boolean;
  @Output('logout') logout = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.showActive = /users\/\d+/.test(this.router.url) || /users\/?$/.test(this.router.url);
    this.unsubscribe$ = new Subject();
    this.collapsed = false;
    this.user = this.authService.user.userData;
    this.getAvatarUrl = Global.api + 'user/get-avatar/';
    this.defaultUrl = 'https://api.dicebear.com/6.x/bottts/svg?seed=';
    this.avatarUrl = '';
    this.regexUrl = /https?:\/\/.+\..+/;
  }

  ngOnInit(): void {
    this.getUrlImge();
    this.collapsed = window.innerWidth <= 800;

    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showActive = /users\/\d+/.test(event.url) || /users\/?$/.test(event.url)
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.collapsed = event.target.innerWidth <= 800;
  }

  getUrlImge(): void {
    if (this.user.avatar != null && this.user.avatar != '') {
      if (this.regexUrl.test(this.user.avatar)) {
        this.avatarUrl = this.user.avatar;
      } else {
        this.avatarUrl = this.getAvatarUrl + this.user.avatar;
      }
    } else {
      this.avatarUrl = this.defaultUrl + this.user.nick;
    }
  }

  // Logout the user
  onLogout(): void {
   this.logout.emit();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
