import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, Topic, ListTopic } from 'src/app/models/receive/list-topics';
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
  }

  ngOnInit() {
    if (this.route.snapshot.data['response']) {
      console.log(this.route.snapshot.data['response']);
      this.category = this.route.snapshot.data['response'].category;
      this.topics = this.route.snapshot.data['response'].topics;
      this.total = this.route.snapshot.data['response'].total;
      this.last_page = this.route.snapshot.data['response'].last_page;
      this.current_page = this.route.snapshot.data['response'].current_page;
      this.loading = false;
    } else {
      this.loading = false;
      this.router.navigate(['/']);
    }
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  changePage(page: number) {
    this.categoryService
      .topics(this.category.id.toString(), page.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(filter((res: ListTopic) => res.topics.length > 0)) //test
      .subscribe({
        next: (res) => {
          this.total = res.total;
          this.last_page = res.last_page;
          this.current_page = res.current_page;
          this.category = res.category;
          this.topics = res.topics;
          //can_post?
        },

        complete: () => {
          this.loading = false;
        }
      });
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
