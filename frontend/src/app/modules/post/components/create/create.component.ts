import { Component, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss', '../../../../styles/card.scss'],
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
  public post: CreatePost;

  constructor(
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private postService: PostService
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = false;
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.userLogged = null;
    this.editorConfig = {
      minHeight: '200px',
      editable: true,
    };
    this.post = {
      topic_id: 0,
      content: '',
    };
  }

  ngOnInit(): void {
    this.post.topic_id = parseInt(this.route.snapshot.paramMap.get('id') ?? '0');

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
    this.postService
      .post(this.post)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.router.navigate([`/topic/${this.post.topic_id}`]);
          this.toastService.show('Post created successfully');
        },
        error: (e) => console.log(e),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
