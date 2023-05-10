import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { CreatePost } from 'src/app/models/send/create-post';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { PostService } from '../../service/post.service';
import { Global } from 'src/environment/global';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public editorConfig: AngularEditorConfig;
  public loading: boolean;
  public error: string;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public post: CreatePost;
  public topic: string;
  public topicList: { id: number; title: string }[];
  public post_id: string;

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private postService: PostService
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.userLogged = null;
    this.editorConfig = {
      minHeight: '200px',
      editable: true,
      uploadUrl: `${Global.api}upload/images`,
      uploadWithCredentials: true,
    };
    this.post = {
      topic_id: 0,
      content: '',
    };
    this.post_id = this.route.snapshot.paramMap.get('id') ?? '0';
    this.topic = '';
    this.topicList = [];
  }

  ngOnInit(): void {
    if (this.post_id === '0') {
      this.router.navigate([`/error`]);
    }

    this.postService
      .onePost(this.post_id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.post = res.post;
          this.topic = res.topic.title;
        },
        error: (err) => {
          if (err.status == 403) {
            this.router.navigate([`/error`]);
          } else {
            console.log(err);
          }
        },
        complete: () => {
          this.loading = false;
        },
      });

    this.authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userLogged = r;
        if (this.userLogged && this.userLogged.userData.isAdmin) {
          this.postService
            .allTopic()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (res) => {
                this.topicList = res;
              },
              error: (err) => {
                console.log(err);
              },
              complete: () => {
                this.loading = false;
              },
            });
        }
      },
    });

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  onSubmit(): void {
    if (
      this.post.topic_id !== undefined &&
      this.post.content.length > 0 &&
      this.post.content.length < 10_000
    ) {
      this.postService
        .editPost(this.post_id, this.post)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.router.navigate([`/topic/${this.post.topic_id}`]);
            this.toastService.show('Post edited successfully');
          },
          error: (e) => console.log(e),
        });
      this.error = '';
    } else {
      this.error = 'Invalid form data';
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
