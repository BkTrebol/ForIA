import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Validators,
  FormBuilder,
  NonNullableFormBuilder,
  FormGroup,
} from '@angular/forms';
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
  public last_page: number;
  public current_page: number;
  public total: number;
  public category: Category;
  // public topic: Topic;
  public topic: Topic;
  // public posts: Array<Post>;
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
  constructor(
    private topicService: TopicService,
    public route: ActivatedRoute,
    public router: Router
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.last_page = 1;
    this.current_page = 1;
    this.total = 1;
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
  }

  ngOnInit() {
    if (this.route.snapshot.data['response']) {
      console.log(this.route.snapshot.data['response']);
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
      this.router.navigate(['/category']);
    }
  }

  submitPost() {
    let obj = { content: this.content?.value, topic_id: this.topic.id };
    console.log('submit post', obj);
    this.topicService.createPost(obj).subscribe({
      next: (res) => {
        // console.log(res);
        this.topicService.posts(this.topic.id.toString(), this.current_page.toString()).subscribe({
          next: (res) => {
            console.log(res);
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
    window.scroll(0, 0);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
