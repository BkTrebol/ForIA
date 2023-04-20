import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { PrivateMessageService } from '../../service/private-message.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { newPrivateMessage } from 'src/app/models/receive/list-pm';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss', '../../../../styles/card.scss'],
})
export class ReplyComponent implements OnInit, OnDestroy{
  private unsubscribe$: Subject<void>;
  public loading: boolean;
  public message: newPrivateMessage;
  public topicTitle: string;
  public editorConfig: AngularEditorConfig;
  public theme:string;
  constructor(
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private ActivatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.theme = themeService.getTheme();
    this.unsubscribe$ = new Subject();
    this.loading = false;
    this.topicTitle = '';
    this.message = {
      title:'',
      recipient:0,
      content: '',
    };
    this.editorConfig = {
      height: '200px',
      editable: true,
    };
  }
  ngOnInit(): void {

    this.ActivatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: ParamMap) => {
        // this.message.topic_id = parseInt(params.get('id') ?? '0');
        // this.privateMessageService.getTopic(this.message.topic_id).subscribe({
        //   next: (r) => {
        //     this.topicTitle = r.title;
        //   },
        // });
      });

      this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }


  onSubmit() {
    console.log(this.message.content);
    // this.privateMessageService
    //   .replyMessage(this.message)
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe({
    //     next: (r) => {
    //       this.router.navigate([`/private-message/${this.message.topic_id}}`]);
    //     },
    //     error: (e) => console.log(e),
    //   });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
