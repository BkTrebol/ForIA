import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
