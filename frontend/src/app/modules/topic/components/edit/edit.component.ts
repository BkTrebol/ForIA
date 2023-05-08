import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { OneTopic } from 'src/app/models/receive/edit-topic';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { CategoryService } from 'src/app/modules/category/service/category.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss', '../../../../styles/card.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public topic: OneTopic;
  public topic_id: string;
  public category_title: string;
  public categoryList: { id: number; title: string }[];
  public theme: string;
  public loading: boolean;
  public error: string;
  public pollToggle: boolean;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public editorConfig: AngularEditorConfig;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = false;
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.pollToggle = false;
    this.userLogged = null;
    this.editorConfig = {
      minHeight: '200px',
      editable: true,
    };
    this.topic = {
      category_id: 0,
      title: '',
      content: '',
      description: '',
    };
    this.topic_id = this.route.snapshot.paramMap.get('id') ?? '0';
    this.category_title = '';
    this.categoryList = [];
  }

  ngOnInit(): void {
    if (this.topic_id == '0') {
      this.router.navigate([`/error`]);
    }

    this.categoryService
      .oneTopic(this.topic_id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.topic = res.topic;
          this.category_title = res.category.title;
        },
        error: (err) => {
          console.log(err);
        },
      });

    this.authService.authData.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (r) => {
        this.userLogged = r;
        if (this.userLogged && this.userLogged.userData.isAdmin) {
          this.categoryService
            .allCateogry()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: (res) => {
                this.categoryList = res;
              },
              error: (err) => {
                console.log(err);
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
    this.categoryService
      .editTopic(this.topic_id, this.topic)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.router.navigate([`/topic/${this.topic_id}`]);
          this.toastService.show(res.message);
        },
        error: (e) => console.log(e),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
