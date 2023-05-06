import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { GuardsCheckEnd, GuardsCheckStart, NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss','./styles/style.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit,OnDestroy {
  private unsubscribe$: Subject<void>;
  public isAdmin:boolean;
  constructor(
    private _authService: AuthService,
    private _router: Router
  ){
    this.unsubscribe$ = new Subject();
    this.isAdmin = false;
  }
  ngOnInit(): void {
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
    console.log('destrouyed')
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
