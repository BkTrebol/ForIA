import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  PrivateMessage,
  PrivateMessageList,
  newPrivateMessage,
} from 'src/app/models/receive/list-pm';
import { PrivateMessageService } from '../../service/private-message.service';
import { ActivatedRoute, RouteReuseStrategy, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';

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

  constructor(
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService
  ) {
    this.theme = themeService.getTheme();
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.pmId = '';
    this.page = 1;
    this.editorConfig = {
      minHeight: '200px',
      editable: true,
    };
    this.reply = {
      recipient: 0,
      title: '',
      content: '',
      thread_id: 0,
    };
    this.error = '';
    this.userLogged = null;

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
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
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
          this.reply.thread_id = r.message.thread_id;
          this.reply.recipient = r.recipient;
          this.privateMessageList = r;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  changePage(page: number) {
    this.page = page;
    this.getData();
  }

  onSubmit() {
    if (this.reply.content.length == 0) {
      this.error = "Reply can't be empty";
      return;
    } else if (this.reply.content.length > 10_000) {
      this.error = "Reply can't be longer than 10.000 characters";
      return;
    } else {
      this.error = '';
    }

    this.privateMessageService
      .sendMessage(this.reply)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          // console.log(r)
          this.scrollToTop();
          this.router.navigate([`/private-message/${r.id}`]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
