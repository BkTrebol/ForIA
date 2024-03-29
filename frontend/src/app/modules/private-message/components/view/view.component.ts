import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  PrivateMessageList,
  newPrivateMessage,
} from 'src/app/models/receive/list-pm';
import { PrivateMessageService } from '../../service/private-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { environment } from 'src/environments/environment';
import {  TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public privateMessageList?: PrivateMessageList;
  public loading: boolean;
  public pmId: string;
  private page: number;
  public theme: string;
  public editorConfig: AngularEditorConfig;
  public reply: newPrivateMessage;
  public error: string;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public ocult: boolean;
  public posting: boolean;
  constructor(
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
    private _translateService: TranslateService

  ) {
    this.posting = false;
    this.theme = themeService.getTheme();
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.pmId = '';
    this.page = 1;
    this.editorConfig = {
      minHeight: '200px',
      editable: true,
      uploadUrl: `${environment.api}upload/images`,
      uploadWithCredentials: true,
    };
    this.reply = {
      recipient: 0,
      title: '',
      content: '',
      thread_id: 0,
    };
    this.error = '';
    this.userLogged = null;
    this.ocult = true;

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.pmId = params.get('id') ?? '';
          this.page = this.route.snapshot.queryParams['page'] ?? 1;
          return this.privateMessageService.getMessage(this.pmId, this.page);
        })
      )
      .subscribe({
        next: (r) => {
          this.reply.title = r.message.title.startsWith('Re:')
            ? r.message.title
            : 'Re: ' + r.message.title;
          this.reply.content = '';
          this.reply.thread_id = r.message.thread_id;
          this.reply.recipient = r.recipient;
          this.privateMessageList = r;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },

      });
  }

  ngOnInit() {
    this.getData();

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

  getData() {
    this.loading = true;
    this.privateMessageService
      .getMessage(this.pmId, this.page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.loading = false;
          this.reply.thread_id = r.message.thread_id;
          this.reply.recipient = r.recipient;
          this.privateMessageList = r;
        },
        error: () => {
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
          setTimeout(() => {
            this.ocult = false;
          }, 100)

        },
      });
  }

  changePage(page: number) {
    this.page = page;
    this.getData();
  }

  onSubmit() {
    this.posting = true;
    if (this.reply.content.length == 0) {
      this.error = this._translateService.instant("VALIDATION.MESSAGE.EMPTY");
      this.posting = false;
      return;
    } else if (this.reply.content.length > 10_000) {
      this.error = this._translateService.instant("VALIDATION.MESSAGE.LONG");
      this.posting = false;
      return;
    } else {
      this.error = '';
    }

    this.privateMessageService
      .sendMessage(this.reply)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.posting = false;
          this.scrollToTop();
          this.router.navigate([`/private-message/${r.id}`]);
        },
        error: () => {
          this.posting = false;
        },
      });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggle() {
    this.ocult = !this.ocult;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
