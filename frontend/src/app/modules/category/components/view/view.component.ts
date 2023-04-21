import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Category,
  Topic,
  ListTopics,
} from 'src/app/models/receive/list-topics';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public category: Category;
  public topics: Topic[];
  public last_page: number;
  public current_page: number;
  public total: number;
  public audioUrl: string;
  public theme: string;

  public listTopics: ListTopics;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private categoryService: CategoryService
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.category = {
      id: 0,
      title: '',
      can_post: false,
    };
    this.topics = [];
    this.last_page = 1;
    this.current_page = 1;
    this.total = 1;
    this.audioUrl = 'http://localhost:8000/things/nc01008.mp3';
    this.theme = this.themeService.getTheme();

    this.listTopics = {
      category: {
        id: 0,
        title: '',
        can_post: false,
      },
      topics: [],
      page: {
        total: 1,
        current: 1,
        last: 1,
      }
    };
  }

  ngOnInit() {
    this.getData(
      this.route.snapshot.paramMap.get('id') ?? '',
      this.route.snapshot.queryParams['page'] ?? '1'
    );

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  getData(id: string, page: string) {
    this.categoryService
      .topics(id, page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.listTopics = res;
          this.loading = false;

          if (this.route.snapshot.fragment == 'last') {
            setTimeout(() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
              });
            }, 100);
          } else {
            this.scrollToTop();
          }

          if (this.listTopics.topics.length == 0) {
            this.loading = true;
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { page: this.listTopics.page.last },
              queryParamsHandling: 'merge',
            });
            this.getData(
              this.listTopics.category.id.toString(),
              this.listTopics.page.last.toString()
            );
          } else {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {
                page:
                  this.listTopics.page.current == 1
                    ? null
                    : this.listTopics.page.current,
              },
              queryParamsHandling: 'merge',
            });
            this.loading = false;
          }
        },
        error: (err) => {
          this.loading = false;
          console.log(err);
        },
      });
  }

  changePage(page: number) {
    this.getData(this.listTopics.category.id.toString(), page.toString());
  }

  playAudio() {
    let audio = new Audio();
    audio.src = this.audioUrl;
    audio.load();
    audio.play();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
