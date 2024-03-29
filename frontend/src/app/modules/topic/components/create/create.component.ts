import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { Topic } from 'src/app/models/send/create-topic';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { CategoryService } from 'src/app/modules/category/service/category.service';
import { environment } from 'src/environments/environment';
import {  TranslateService } from '@ngx-translate/core';
import { Role } from 'src/app/models/receive/admin-role';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public topic: Topic;
  public theme: string;
  public loading: boolean;
  public error: string;
  public pollToggle: boolean;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public editorConfig: AngularEditorConfig;
  public roleList: Role[];
  public posting: boolean;
  
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private _translateService: TranslateService
  ) {
    this.posting = false;
    this.roleList = [];
    this.unsubscribe$ = new Subject();
    this.loading = false;
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.pollToggle = false;
    this.userLogged = null;
    this.editorConfig = {
      minHeight: '200px',
      editable: true,
      uploadUrl: `${environment.api}upload/images`,
      uploadWithCredentials: true,
    };
    this.topic = {
      category_id: parseInt(this.route.snapshot.paramMap.get('id') ?? '0'),
      title: '',
      content: '',
      description: '',
      can_view:1,
      can_post:2,
      poll: {
        name: '',
        options: [{ option: '' }, { option: '' }],
      },
    };
  }

  ngOnInit(): void {
    if (this.topic.category_id == 0) {
      this.router.navigate([`/error`]);
    }

    this.categoryService.getRoles(this.topic.category_id)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(r => {
      this.roleList = r;
    })

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

  onAddOption(): void {
    this.topic.poll.options.push({ option: '' });
  }

  onDeleteOption(index: number): void {
    this.topic.poll.options.splice(index, 1);
  }

  onSubmit(): void {
    this.posting = true;
    this.categoryService
      .post(this.topic)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.posting = false;
          this.router.navigate([`/topic/${res.id}`]);
          this.toastService.show(this._translateService.instant(res.message));
        },
        error: () => this.posting = false,
      });
  }

  togglePoll(): void {
    this.pollToggle = !this.pollToggle;
    if (!this.pollToggle) {
      this.topic.poll = {
        name: '',
        options: [{ option: '' }, { option: '' }],
      };
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
