import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public innerWidth: number;
  public original: boolean;

  @Input() type: string;
  @Input() height: string;
  @Input() width: string;
  @Input() appa: string;

  constructor(private themeService: ThemeService) {
    this.unsubscribe$ = new Subject();
    this.theme = themeService.getTheme();
    this.type = '';
    this.height = '100px';
    this.width = '100px';
    this.appa = 'line';
    this.original = false;
    this.innerWidth = window.innerWidth;
  }

  ngOnInit(): void {
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t: string) => {
        this.theme = t;
      });

    this.innerWidth = window.innerWidth;
    if (this.appa === 'circle') {
      if (this.width == '100px') {
        this.original = true;
      }
      this.changeCircleSize();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.appa === 'circle') {
      this.changeCircleSize();
    }
  }

  changeCircleSize(): void {
    if (this.innerWidth <= 500) {
      this.height = '50px';
      this.width = '50px';
    } else if (this.innerWidth <= 800) {
      this.height = '65px';
      this.width = '65px';
    } else {
      if (this.original) {
        this.height = '100px';
        this.width = '100px';
      } else {
        this.height = '75px';
        this.width = '75px';
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
