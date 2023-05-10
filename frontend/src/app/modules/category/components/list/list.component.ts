import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../service/category.service';
import { Forum } from '../../../../models/receive/list-category';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { Global } from 'src/environment/global';

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
  public isCollapsed = false;
  public apiImageUrl: string;

  constructor(
    private categoryService: CategoryService,
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.apiImageUrl = Global.api+'upload/images/'
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
          res.forEach((section) => {
            this.ocults[section.name] = false;
          });
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.loading = false;
        },
      });

    if (this.route.snapshot.data['response']) {
      setTimeout(() => {
        this.toastService.show('Logged in with Google successfully');
        this.router.navigate([], {
          relativeTo: this.route,
          queryParamsHandling: 'merge',
        });
      });
    }

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
