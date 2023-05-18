import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
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
import { environment } from 'src/environments/environment';
import {  TranslateService } from '@ngx-translate/core';
import { Role } from 'src/app/models/receive/admin-role';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
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
  public posting: boolean;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public editorConfig: AngularEditorConfig;
  public roleList: Role[]

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private _translateService:TranslateService
  ) {
    this.posting = false;
    this.unsubscribe$ = new Subject();
    this.loading = false;
    this.theme = this.themeService.getTheme();
    this.error = '';
    this.pollToggle = false;
    this.userLogged = null;
    this.roleList = [];
    this.editorConfig = {
      minHeight: '200px',
      editable: true,
      uploadUrl: `${environment.api}upload/images`,
      uploadWithCredentials: true,
    };
    this.topic = {
      is_admin:false,
      is_mod:false,
      category_id: 0,
      title: '',
      content: '',
      description: '',
      can_view:1,
      can_post:2,
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
          if(res.topic.is_admin || res.topic.is_mod){
            this.categoryService.getRoles(res.topic.category_id)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(r => {
              this.roleList = r;
            })
          }
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
    this.posting = true;
    this.categoryService
      .editTopic(this.topic_id, this.topic)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.posting = false;
          this.router.navigate([`/topic/${this.topic_id}`]);
          this.toastService.show(this._translateService.instant(res.message));
        },
        error: () => this.posting = false,
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
