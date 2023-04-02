import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../../service/topic.service';
import { Category } from 'src/app/models/category';
import { Topic } from 'src/app/models/topic';
import { Post } from 'src/app/models/post';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public category: Category;
  public topic: Topic;
  public posts: Array<Post>;
  public id: string | null;
  public audioUrl: string;

  constructor(
    private topicService: TopicService,
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
    this.topic = {
      id: 0,
      category_id: 0,
      user_id: 0,
      title: '',
      description: '',
      can_post: false,
      can_mod: false,
      created_at: '',
      updated_at: ''
    }
    this.id = this.route.snapshot.paramMap.get('id');
    this.posts = [];
    this.audioUrl = 'http://localhost:8000/things/nc01008.mp3';
  }

  ngOnInit() {
    if (this.id === null) {
      this.router.navigate(['']);
    } else {
      this.topicService
        .topic(this.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.topic = res;
            this.topicService
              .category(this.topic.category_id)
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: (res) => {
                  this.category = res;
                  // this.loading = false;
                },
                error: (err) => {
                  console.log(err);
                  // this.router.navigate(['']);
                  // this.loading = false;
                },
              });
          },
          error: (err) => {
            console.log(err);
            // this.loading = false;
          },
        });
      this.topicService
        .posts(this.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.posts = res.posts;
            this.loading = false;
          },
          error: (err) => {
            console.log(err);
            this.loading = false;
          },
        });
    }
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
