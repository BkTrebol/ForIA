import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PrivateMessageService } from '../../service/private-message.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { newPrivateMessage } from 'src/app/models/receive/list-pm';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserPreferences } from 'src/app/models/user-preferences';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss', '../../../../styles/card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  // public content: string;
  public userList$: Observable<any>;
  // public user?: string;
  // public title?: string;
  public message: newPrivateMessage;
  public editorConfig: AngularEditorConfig;
  public theme: string;
  public userLogged: {
    userData: User;
    userPreferences: UserPreferences;
  } | null;
  public error: string;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private authService: AuthService
  ) {
    this.theme = themeService.getTheme();
    this.unsubscribe$ = new Subject();
    this.loading = false;
    // this.content = '';
    this.userList$ = new Observable();
    this.message = {
      recipient: undefined,
      title: '',
      content: '',
    };
    this.editorConfig = {
      height: '200px',
      editable: true,
    };
    this.userLogged = null;
    this.error = '';
  }

  ngOnInit(): void {
    this.userList$ = this.privateMessageService.getUserList();

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
    if (this.message.content.length == 0) {
      this.error = "Message can't be empty";
      return;
    } else if (this.message.content.length > 10_000) {
      this.error = "Message can't be longer than 10.000 characters";
      return;
    } else {
      this.error = '';
    }

    this.privateMessageService
      .sendMessage(this.message)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => this.router.navigate([`/private-message/${r.id}`]),
        error: (e) => console.log(e),
      });
  }

  // onSelectChange(event: any) {
  //   this.message.recipient = event.id;
  // }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
