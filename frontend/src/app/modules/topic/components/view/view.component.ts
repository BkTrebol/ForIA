import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../../service/topic.service';
import { Category, Topic, Post } from 'src/app/models/receive/list-posts';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public category: Category;
  // public topic: Topic;
  public topic: Topic;
  // public posts: Array<Post>;
  public posts: Post[];
  public can_post: boolean;
  public can_edit: boolean;
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
      // section: '',
    };
    this.topic = {
      id: 0,
      // user_id: 0,
      title: '',
      content: '', // description: '',
      // can_mod: false,
      created_at: '',
      updated_at: '',
      user: { id: 0, nick: '', roles: [], avatar: null },
    };
    this.can_post = false;
    this.can_edit = false;
    this.posts = [];
    this.audioUrl = 'http://localhost:8000/things/nc01008.mp3';
  }

  ngOnInit() {
    if (this.route.snapshot.data['response']) {
      this.category = this.route.snapshot.data['response'].category;
      this.topic = this.route.snapshot.data['response'].topic;
      this.posts = this.route.snapshot.data['response'].posts;
      this.can_post = this.route.snapshot.data['response'].can_post;
      this.can_edit = this.route.snapshot.data['response'].can_edit;
      this.loading = false;
    } else {
      this.loading = false;
      this.router.navigate(['/category']);
    }
    // this.topicService
    //   .posts(this.id)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe({
    //     next: (res) => {
    //       this.category = res.category;
    //       this.topic = res.topic;
    //       this.posts = res.posts;
    //       this.can_post = res.can_post;
    //       this.can_edit = res.can_edit;
    //       this.loading = false;
    //       console.log(this.posts)
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
