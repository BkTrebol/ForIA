import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TopicService } from '../../service/topic.service';
import { ListPosts, Poll } from 'src/app/models/receive/list-posts';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public loading2: boolean;
  public listPosts: ListPosts;
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
  public actualDate: Date;
  public post_delete: number;
  public post_by: string;
  public newPostId: string;
  public posting: boolean;
  constructor(
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private toastService: ToastService,
    private authService: AuthService,
    private modalService: NgbModal,
    private _translateService: TranslateService
  ) {
    this.posting = false;
    this.newPostId = '';
    this.showResults = false;
    this.vote = null;
    this.listPosts = {
      closed:false,
      can_mod:false,
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
          public_role: { name: '' },
          created_at: '',
        },
      },
      posts: [],
      poll: {
        can_vote: false,
        can_edit: false,
        finish_date: '',
        id: 0,
        name: '',
        votes: 0,
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
    this.loading2 = false;
    this.content = '';
    this.error = '';
    this.editorConfig = {
      uploadUrl: `${environment.api}upload/images`,
      uploadWithCredentials: true,
      minHeight: '200px',
      editable: true,
      sanitize: false,
    };
    this.theme = themeService.getTheme();
    this.userLogged = null;
    this.actualDate = new Date();
    this.post_delete = NaN;
    this.post_by = '';
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: Params) => {
        this.loading = true;
        this.getData(
          params['id'],
          this.route.snapshot.queryParams['page'] ?? '1'
        );
      });

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

  getData(id: string, page: string, noScroll: boolean = false) {
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
          } else if (noScroll) {
            setTimeout(() => {
              const id =
                this.newPostId != ''
                  ? this.newPostId
                  : this.route.snapshot.fragment ?? '';
              if (id != '' && id) {
                document.getElementById(id)?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                  inline: 'start',
                });
              }
            }, 100);
          } else {
            this.scrollToTop();
          }

          if (res.poll) {
            this.loading2 = true;
            this.checkPoll();
          }
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

  toggleTopic(){
    this.topicService.toggleTopic(this.listPosts.topic.id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: r => {
        this.toastService.show(this._translateService.instant(r.message))
        this.listPosts.closed = !this.listPosts.closed;
      },
      error: e => {
        this.toastService.showDanger(this._translateService.instant(e))
      }
    })
  }


  onSubmit() {
    this.posting = true;
    if (this.content.length == 0) {
      this.error = this._translateService.instant("VALIDATION.POST.EMPTY");
      this.posting = false;
      return;
    } else if (this.content.length > 10_000) {
      this.error = this._translateService.instant("VALIDATION.POST.LONG");
      this.posting = false;
      return;
    } else {
      this.error = '';
    }

    const post = { content: this.content, topic_id: this.listPosts.topic.id };
    this.topicService
      .createPost(post)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.newPostId = res.id.toString();
          this.content = '';
          this.error = '';
          this.posting = false;
          if (res.hasOwnProperty('newRole')) {
            this.toastService.show(
              `${this._translateService.instant('EVOLVED')} ${res.newRole.name}`
            );
            if (this.userLogged)
              this.userLogged.userData.public_role = res.newRole;
          }
          this.getData(this.listPosts.topic.id.toString(), res.lastPage, true);
        },
        error: (err) => {
          this.posting = false;;
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
            this.listPosts.page.current.toString(),
            true
          );
          this.toastService.show(res.message);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteTopic(id: number) {
    this.topicService
      .deleteTopic(id.toString())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.toastService.show(res.message);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  checkPoll() {
    if (this.listPosts.poll) {
      this.getVotes();
      if (this.listPosts.poll.can_vote === false) {
        this.showResults = true;
      }
    } else {
      this.loading2 = false;
    }
  }

  getVotes() {
    this.topicService
      .getPollVotes(this.listPosts.poll.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.pollResults = res;
        },
        error: (e) => console.log(e),
        complete: () => (this.loading2 = false),
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
            // this.getVotes();
            this.getData(
              this.route.snapshot.paramMap.get('id') ?? '',
              this.route.snapshot.queryParams['page'] ?? '1'
            );
          },
          error: (e) => console.log(e),
        });
    }
  }

  closePoll() {
    this.topicService.closePoll(this.listPosts.poll.id.toString()).subscribe({
      next: (res) => {
        this.toastService.show(res.message);
        this.getData(
          this.route.snapshot.paramMap.get('id') ?? '',
          this.route.snapshot.queryParams['page'] ?? '1'
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deletePoll() {
    this.topicService.deletePoll(this.listPosts.poll.id.toString()).subscribe({
      next: (res) => {
        this.toastService.show(res.message);
        this.getData(
          this.route.snapshot.paramMap.get('id') ?? '',
          this.route.snapshot.queryParams['page'] ?? '1'
        );
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openModal(modal: any) {
    this.modalService.open(modal, { centered: true });
  }

  openModalPost(modal: any, id: number, nick: string) {
    this.post_delete = id;
    this.post_by = nick;
    this.modalService.open(modal, { centered: true });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
