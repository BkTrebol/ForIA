import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
import { TopicService } from '../../service/topic.service';
import { ListPosts, Category, Topic, Post } from 'src/app/models/receive/list-posts';
import { ThemeService } from 'src/app/helpers/services/theme.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public last_page: number;
  public current_page: number;
  public total: number;
  public category: Category;
  public topic: Topic;
  public posts: Post[];
  public can_post: boolean;
  public can_edit: boolean;
  public audioUrl: string;
  public formPost: FormGroup;
  public formBuilderNonNullable: NonNullableFormBuilder;
  public validationMessagesPost = {
    content: {
      required: "The Post can't be empty",
      minlength: 'Min Length is 3',
      maxlength: 'Max Length is 255',
    },
  };
  public theme: string;

  constructor(
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.last_page = 1;
    this.current_page = 1;
    this.total = 1;
    this.category = {
      id: 0,
      title: '',
    };
    this.topic = {
      id: 0,
      title: '',
      content: '',
      created_at: '',
      updated_at: '',
      user: { id: 0, nick: '', rol: '', avatar: null, created_at: '' },
    };
    this.can_post = false;
    this.can_edit = false;
    this.posts = [];
    this.audioUrl = 'http://localhost:8000/things/nc01008.mp3';
    this.formBuilderNonNullable = new FormBuilder().nonNullable;
    this.formPost = this.formBuilderNonNullable.group({
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      ],
    });
    this.theme = themeService.getTheme();
  }

  ngOnInit() {
    if (this.route.snapshot.data['response']) {
      this.last_page = this.route.snapshot.data['response'].last_page;
      this.current_page = this.route.snapshot.data['response'].current_page;
      this.category = this.route.snapshot.data['response'].category;
      this.topic = this.route.snapshot.data['response'].topic;
      this.posts = this.route.snapshot.data['response'].posts;
      this.can_post = this.route.snapshot.data['response'].can_post;
      this.can_edit = this.route.snapshot.data['response'].can_edit;
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
    this.topicService
      .posts(this.topic.id.toString(), page.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .pipe(filter((res: ListPosts) => res.posts.length > 0)) //test
      .subscribe({
        next: (res) => {
          this.total = res.total;
          this.last_page = res.last_page;
          this.current_page = res.current_page;
          this.category = res.category;
          this.topic = res.topic;
          this.posts = res.posts;
          this.can_post = res.can_post;
          this.can_edit = res.can_edit;
        },
      });
  }

  submitPost() {
    if (this.formPost.valid) {
      const post = { content: this.content?.value, topic_id: this.topic.id };
      this.topicService
        .createPost(post)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.topicService
              .posts(this.topic.id.toString(), this.current_page.toString())
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: (res) => {
                  console.log(res);
                  this.posts = res.posts;
                },
                error: (err) => {
                  console.log(err);
                },
              });
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      console.log('Post invalid');
    }
  }

  deletePost(id: number) {
    this.topicService
      .deletePost(id.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.topicService
            .posts(this.topic.id.toString(), this.current_page.toString())
            .subscribe({
              next: (res) => {
                this.posts = res.posts;
              },
            });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  get content() {
    return this.formPost.get('content');
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
