import {  Component,Renderer2, OnDestroy, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { Subject, filter, takeUntil } from 'rxjs';
import {  NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss',],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit,OnDestroy {
  private unsubscribe$: Subject<void>;
  public isAdmin:boolean;
  private styleSheet: HTMLLinkElement |undefined;
  public loading:boolean;;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private _authService: AuthService,
    private _router: Router
  ){
    this.unsubscribe$ = new Subject();
    this.isAdmin = false;
    this.loading = true;
  }
  ngOnInit(): void {
    this._router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: any) => {
        this.loading = false;
    });
    
    this.styleSheet = this.renderer.createElement('link');
    this.renderer.setAttribute(this.styleSheet, 'rel', 'stylesheet');
    this.renderer.setAttribute(this.styleSheet, 'href', 'assets/adminStyles.css');
    this.renderer.appendChild(this.el.nativeElement.ownerDocument.head, this.styleSheet);
    this._authService.checkAdmin().subscribe(
      r => {
        if(!r){
          this._router.navigate(['admin/login']);
        } 
      }
    );
    this._authService.$isAdmin
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((r) =>{
      this.isAdmin = r != null ? r : false;
    })

  }

  ngOnDestroy(): void {
    this.renderer.removeChild(this.el.nativeElement.ownerDocument.head, this.styleSheet);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
