import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';

function random(min: number, max: number) {
   return  Math.floor(Math.random() * max) + min;
}

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public innerWidth: any;
  @Input('type') type: string;
  @Input('height') height: string;
  @Input('width') width: string;
  @Input('appa') appa: string;

  constructor(private themeService: ThemeService) {
    this.unsubscribe$ = new Subject();
    this.theme = themeService.getTheme();
    this.type = '';
    this.height = '100px';
    this.width = '100px';
    this.appa = 'line';
  }

  ngOnInit(): void {
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
    this.innerWidth = window.innerWidth;
    if (this.appa === 'circle') {
      this.changeCircleSize();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: any) {
    this.innerWidth = window.innerWidth;
    if (this.appa === 'circle') {
      this.changeCircleSize();
    }
  }

  changeCircleSize() {
    if (this.innerWidth <= 500) {
      this.height = '50px';
      this.width = '50px';
    } else if (this.innerWidth <= 800) {
      this.height = '65px';
      this.width = '65px';
    } else {
      this.height = '75px';
      this.width = '75px';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
