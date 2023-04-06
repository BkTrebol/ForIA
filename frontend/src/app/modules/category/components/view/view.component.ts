import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../service/category.service';
import { Category } from 'src/app/models/category';
import { Topic } from 'src/app/models/topic';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public category: Category;
  public topics: Array<Topic>;
  public audioUrl: string;

  constructor(
    private categoryService: CategoryService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.category = {
      id: 0,
      title: '',
      section: '',
      description: '',
      image: '',
      music: '',
      can_mod: false,
    };
    this.topics = [];
    this.audioUrl = 'http://localhost:8000/things/nc01008.mp3';
  }

  ngOnInit() {
    if (this.route.snapshot.data['response']) {
      this.category = this.route.snapshot.data['response'].category;
      this.topics = this.route.snapshot.data['response'].topics;
      this.loading = false;
    } else {
      this.loading = false;
      this.router.navigate(['/category']);
    }
    // this.categoryService
    //   .topics(this.id)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe({
    //     next: (res) => {
    //       this.topics = res.topics;
    //       this.loading = false;
    //     },
    //     error: (err) => {
    //       console.log(err);
    //       this.loading = false;
    //     },
    //   });
  }

  playAudio() {
    let audio = new Audio();
    audio.src = this.audioUrl;
    audio.load();
    audio.play();
  }

  scrollToTop() {
    window.scroll(0, 0);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
