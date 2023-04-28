import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  ActivatedRoute,
  Params,
  RouteReuseStrategy,
  Router,
} from '@angular/router';
import { TopicService } from '../../service/topic.service';
import {
  Category,
  Topic,
  Post,
  ListPosts,
  Poll,
} from 'src/app/models/receive/list-posts';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { Global } from 'src/app/environment/global';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public listPosts: ListPosts;
  public audioUrl: string;
  public content: string;
  public error: string;
  public editorConfig: AngularEditorConfig;
  public vote: number | null;
  public showResults: boolean;
  public pollResults?: Poll;
  public theme: string;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;

  constructor(
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.showResults = false;
    this.vote = null;
    this.listPosts = {
      can_poll: false,
      can_edit: false,
      can_post: false,
      category: {
        id: 0,
        title: '',
      },
      topic: {
        id: 0,
        title: '',
        created_at: '',
        updated_at: '',
        content: '',
        user: {
          id: 0,
          nick: '',
          avatar: '',
          rol: '',
          created_at: '',
        },
      },
      posts: [],
      poll: {
        can_vote: false,
        can_edit: false,
        finish_date: new Date(),
        id: 0,
        name: '',
        options: [],
      },
      page: {
        current: 1,
        last: 1,
        total: 1,
      },
    };
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.audioUrl = 'http://localhost:8000/things/nc01008.mp3';
    this.content = '';
    this.error = '';
    this.editorConfig = {
      uploadUrl:`${Global.api}upload/images`,
      uploadWithCredentials: true,
      minHeight: '200px',
      editable: true,
    };
    this.theme = themeService.getTheme();
    this.userLogged = null;
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.loading = true;
        this.getData(params['id'], '1');
      });
    
    this.getData(
      this.route.snapshot.paramMap.get('id') ?? '',
      this.route.snapshot.queryParams['page'] ?? '1'
    );

    this.authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userLogged = r;
      },
    });

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  getData(id: string, page: string) {
    this.topicService
      .posts(id, page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.listPosts = res;
          this.loading = false;
          if (
            parseInt(this.route.snapshot.queryParams['page'] ?? '1') !=
            res.page.current
          ) {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { page: this.listPosts.page.current },
              queryParamsHandling: 'merge',
            });
          }
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

          if (res.poll) {
            this.checkPoll();
          }

          // if (this.listPosts.posts.length == 0) {
          //   this.loading = true;
          //   this.router.navigate([], {
          //     relativeTo: this.route,
          //     queryParams: { page: this.listPosts.page.last },
          //     queryParamsHandling: 'merge',
          //   });
          //   this.getData(
          //     this.listPosts.topic.id.toString(),
          //     this.listPosts.page.last.toString()
          //   );
          // } else {
          //   this.router.navigate([], {
          //     relativeTo: this.route,
          //     queryParams: {
          //       page:
          //         this.listPosts.page.current == 1
          //           ? null
          //           : this.listPosts.page.current,
          //     },
          //     queryParamsHandling: 'merge',
          //   });
          //   this.loading = false;
          // }
        },
        error: (err) => {
          this.loading = false;
          this.router.navigate(['/error']);
          console.log(err);
        },
      });
  }

  changePage(page: number) {
    this.getData(this.listPosts.topic.id.toString(), page.toString());
  }

  onSubmit() {
    if (this.content.length == 0) {
      this.error = "Post can't be empty";
      return;
    } else if (this.content.length > 10_000) {
      this.error = "Post can't be longer than 10.000 characters";
      return;
    }

    const post = { content: this.content, topic_id: this.listPosts.topic.id };
    this.topicService
      .createPost(post)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (_) => {
          this.content = '';
          this.error = '';
          this.getData(
            this.listPosts.topic.id.toString(),
            this.listPosts.page.current.toString()
          );
        },
        error: (err) => {
          console.log(err);
          this.error = err.error.message;
        },
      });
  }

  deletePost(id: number) {
    this.topicService
      .deletePost(id.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.getData(
            this.listPosts.topic.id.toString(),
            this.listPosts.page.current.toString()
          );
          this.toastService.show(res.message);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  playAudio() {
    let audio = new Audio();
    audio.src = this.audioUrl;
    audio.load();
    audio.play();
  }

  checkPoll() {
    if (this.listPosts.poll) {
      this.getVotes();
      if (this.listPosts.poll.can_vote === false) {
        this.showResults = true;
      }
    }
  }

  getVotes() {
    this.topicService
      .getPollVotes(this.listPosts.poll.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.pollResults = res;
        },
        error: (e) => console.log(e),
      });
  }

  onShowPollResults() {
    this.showResults = !this.showResults;
  }

  onVote() {
    if (this.vote) {
      this.topicService
        .vote(this.vote)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (r) => {
            this.showResults = true;
            this.listPosts.poll.can_vote = false;
            this.getVotes();
          },
          error: (e) => console.log(e),
        });
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
