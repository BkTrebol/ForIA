import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PrivateMessageService } from '../../service/private-message.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { newPrivateMessage } from 'src/app/models/receive/list-pm';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { environment } from 'src/environments/environment';
import {  TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReplyComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public reply: newPrivateMessage;
  public editorConfig: AngularEditorConfig;
  public theme: string;
  public title: string;
  public error: string;
  public message_id: number;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public posting: boolean;
  constructor(
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _translateService: TranslateService

  ) {
    this.posting = false;
    this.message_id = 0;
    this.theme = themeService.getTheme();
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.title = '';
    this.error = '';
    this.reply = {
      title: '',
      recipient: 0,
      content: '',
      thread_id: 0,
    };
    this.editorConfig = {
      height: '200px',
      editable: true,
      uploadUrl: `${environment.api}upload/images`,
      uploadWithCredentials: true,
    };
    this.userLogged = null;
  }

  ngOnInit(): void {
    this.ActivatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: ParamMap) => {
        this.message_id = parseInt(params.get('id') ?? '0');
        this.privateMessageService
          .getThread(this.message_id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: (r) => {
              this.title = r.title;
              this.reply.thread_id = r.thread_id;
              this.reply.recipient = r.recipient;
              this.reply.title = r.title.startsWith('Re: ')
                ? r.title
                : `Re: ${r.title}`;
            },
            complete: () => {
              this.loading = false;
            }
          });
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
          this.router.navigate([`/private-message/${r.id}`]);
        },
        error: () =>this.posting = false,
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
