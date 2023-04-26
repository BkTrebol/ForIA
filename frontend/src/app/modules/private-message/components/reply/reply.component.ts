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

  constructor(
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.message_id = 0;
    this.theme = themeService.getTheme();
    this.unsubscribe$ = new Subject();
    this.loading = false;
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
    this.privateMessageService
      .sendMessage(this.reply)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          // console.log(r)
          this.router.navigate([`/private-message/${r.id}}`]);
        },
        error: (e) => console.log(e),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
