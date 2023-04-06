import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../service/category.service';
import { Section, Category } from '../../../../models/receive/list-category'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../../../styles/card.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public sections: Section;
  public categories: Category[];

  constructor(private categoryService: CategoryService) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.sections = { '': []};
    this.categories = [];
  }

  ngOnInit() {
    this.categoryService
      .categories()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          let cat = res.categories;
          // console.log("Cat", cat);
          Object.keys(cat).forEach((section: any) => {
            this.categories.push(cat[section][0]);
          });
          // this.categories = res;
          this.loading = false;
        },
        error: (err) => {
          console.log(err);
          this.loading = false;
        },
      });
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
