import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../service/category.service';
import { Forum } from '../../../../models/receive/list-category'
import { ThemeService } from 'src/app/helpers/services/theme.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../../../styles/card.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public forum: Forum;
  public ocults: { [key: string]: boolean };
  public allSections: boolean;
  public theme: string;

  constructor(
    private categoryService: CategoryService,
    private themeService: ThemeService
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.forum = [];
    this.ocults = {};
    this.allSections = false;
    this.theme = this.themeService.getTheme();
  }

  ngOnInit() {
    this.categoryService
      .categories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.forum = res;
          this.loading = false;
          this.forum.forEach((section) => {
            this.ocults[section.name] = false;
          });
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  toggle(nom: string) {
    this.ocults[nom] = !this.ocults[nom];
  }

  toogleSections() {
    this.allSections = !this.allSections;
    for (let nom in this.ocults) {
      this.ocults[nom] = this.allSections;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
