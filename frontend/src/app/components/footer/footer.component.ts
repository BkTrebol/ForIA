import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss', '../../styles/general.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;

  constructor(private themeService: ThemeService) {
    this.unsubscribe$ = new Subject();
    this.theme = themeService.getTheme();
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
