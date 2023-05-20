import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  @Input() current_page: number;
  @Input() last_page: number;
  @Input() ignoreParams: boolean;

  @Output() changePage;
  @ViewChild('pagination3') pagination: any;

  public theme: string;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private themeService: ThemeService
  ) {
    this.unsubscribe$ = new Subject();
    this.current_page = 1;
    this.last_page = 1;
    this.changePage = new EventEmitter<number>();
    this.ignoreParams = false;
    this.theme = themeService.getTheme();
  }

  ngOnInit(): void {
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t: string) => {
        this.theme = t;
      });
  }

  onChangePage(newPage: number, event: any = null) {
    if (newPage == 0 || newPage == this.current_page) return;

    this.changePage.emit(newPage);
    if (event) event.target.blur();

    if (!this.ignoreParams) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: newPage },
        queryParamsHandling: 'merge',
      });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLLinkElement;
    const keyCode = event.code;
    if (
      +event.key > this.last_page ||
      +`${target.textContent}${event.key}` > this.last_page ||
      (event.key == '0' && target.textContent == '')
    ) {
      event.preventDefault();
    }

    if (
      !/\d/.test(event.key) &&
      keyCode !== 'Enter' &&
      keyCode !== 'Backspace' &&
      keyCode !== 'Delete'
    ) {
      event.preventDefault();
    }
  }

  onFocus(event: FocusEvent) {
    const target = event.target as HTMLLinkElement;
    target.textContent = '';
  }

  onBlur(event: FocusEvent) {
    const target = event.target as HTMLLinkElement;
    target.textContent = '...';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
