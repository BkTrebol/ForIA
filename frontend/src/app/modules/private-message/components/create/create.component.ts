import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PrivateMessageService } from '../../service/private-message.service';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { newPrivateMessage } from 'src/app/models/receive/list-pm';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/helpers/services/toast.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public userList$: Observable<any>;
  public message: newPrivateMessage;
  public editorConfig: AngularEditorConfig;
  public theme: string;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public error: string;
  public posting: boolean;
  constructor(
    private router: Router,
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private _translateService: TranslateService,
    private toastService: ToastService
  ) {
    this.posting = false;
    this.theme = themeService.getTheme();
    this.unsubscribe$ = new Subject();
    this.loading = false;
    this.userList$ = new Observable();
    this.message = {
      recipient: undefined,
      title: '',
      content: '',
    };
    this.editorConfig = {
      height: '200px',
      editable: true,
      uploadUrl: `${environment.api}upload/images`,
      uploadWithCredentials: true,
    };
    this.userLogged = null;
    this.error = '';
  }

  ngOnInit(): void {
    // In case is set an user trough queryParams checks if can PM them.
    const sendTo = parseInt(this.route.snapshot.queryParams['user']);
    if (isNaN(sendTo)) {
      this.userList$ = this.privateMessageService.getUserList();
    } else {
      this.userList$ = this.privateMessageService.getUserList().pipe(
        map((r) => {
          if (r.filter((u: any) => u.id === sendTo).length == 0) {
            this.toastService.showDanger(
              this._translateService.instant('USER_NOT_FOUND')
            );
          } else {
            this.message.recipient = sendTo;
          }
          return r;
        })
      );
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

  onSubmit() {
    this.posting = true;
    if (this.message.content.length == 0) {
      this.error = this._translateService.instant('VALIDATION.MESSAGE.EMPTY');
      this.posting = false;
      return;
    } else if (this.message.content.length > 10_000) {
      this.error = this._translateService.instant('VALIDATION.MESSAGE.LONG');
      this.posting = false;
      return;
    } else {
      this.error = '';
    }

    this.privateMessageService
      .sendMessage(this.message)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.posting = false;
          this.router.navigate([`/private-message/${r.id}`])
        },
      error: () => this.posting = false,
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
