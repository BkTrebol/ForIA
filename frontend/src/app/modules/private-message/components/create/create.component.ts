import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PrivateMessageService } from '../../service/private-message.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { newPrivateMessage } from 'src/app/models/receive/list-pm';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss', '../../../../styles/card.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public content: string;
  public userList$: Observable<any>;
  public user?: string;
  public title?: string;
  public message: newPrivateMessage;
  public editorConfig: AngularEditorConfig;
  public theme:string;
  constructor(
    private router: Router,
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService) {
    this.theme = themeService.getTheme();
    this.unsubscribe$ = new Subject();
    this.loading = false;
    this.content = '';
    this.userList$ = new Observable();
    this.message = {
      recipient: NaN,
      title: '',
      content: '',
      thread_id:0,
    };
    this.editorConfig = {
      height: '200px',
      editable: true,
    };
  }

  ngOnInit(): void {
    this.userList$ = this.privateMessageService.getUserList(this.user ?? '');
    this.themeService.theme
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((t) => {
      this.theme = t;
    });
  }

  onSubmit() {
    this.privateMessageService
      .sendMessage(this.message)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => this.router.navigate([`/private-message/${r.topic}}`]),
        error: (e) => console.log(e),
      });
  }

  onSelectChange(event: any) {
    this.message.recipient = event.id;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
