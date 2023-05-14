import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { GetCreatePost } from 'src/app/models/send/create-post';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { PostService } from '../../service/post.service';
import { environment } from 'src/environments/environment';
import {  TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;
  public editorConfig: AngularEditorConfig;
  public loading: boolean;
  public error: string;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public post: GetCreatePost;
  public topic: string | null;
  public topicList: { id: number; title: string }[];

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private postService: PostService,
    private _translateService:TranslateService
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.userLogged = null;
    this.editorConfig = {
      minHeight: '200px',
      editable: true,
      uploadUrl: `${environment.api}upload/images`,
      uploadWithCredentials: true,
    };
    this.post = {
      topic_id: undefined,
      content: '',
    };
    this.topic = null;
    this.topicList = [];
  }

  ngOnInit(): void {
    this.post.topic_id = parseInt(
      this.route.snapshot.paramMap.get('id') ?? '0'
    );

    if (this.post.topic_id == 0) {
      this.post.topic_id = undefined;
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
    } else {
      this.postService
        .oneTopic(this.post.topic_id.toString())
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.topic = res.title;
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.loading = false;
          },
        });
    }

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

  onSubmit(): void {
    if (this.post.topic_id !== undefined && this.post.content.length > 0 && this.post.content.length < 10_000) {
      this.postService
        .post(this.post)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res) => {
            this.router.navigate([`/topic/${this.post.topic_id}`],
              {              
              queryParams: {page: res.lastPage},
              fragment: res.id
            });
            this.toastService.show(this._translateService.instant("POST_CREATED"));
            if(res.hasOwnProperty('newRole')){
              this.toastService.show(`${this._translateService.instant("EVOLVED")} ${res.newRole.name}`);
            }
          },
          error: (e) => console.log(e),
        });
      this.error = '';
    } else {
      this.error = this._translateService.instant("VALIDATION.WRONG_FORMDATA")
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
