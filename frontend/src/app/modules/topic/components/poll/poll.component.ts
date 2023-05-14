import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { TopicService } from '../../service/topic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Poll } from 'src/app/models/send/create-topic';
import {  TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/helpers/services/toast.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss', '../../../../styles/card.scss'],
})
export class PollComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public mode: string;
  public loading: boolean;
  public error: string;
  public theme: string;
  public poll: Poll;
  public topicId: number;
  public title: string;

  constructor(
    private themeService: ThemeService,
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router,
    private _translateService: TranslateService,
    private _toastService: ToastService

  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.error = '';
    this.theme = this.themeService.getTheme();
    this.mode = 'create';
    this.topicId = 0;
    this.title = '';
    this.poll = {
      finish_date: '',
      name: '',
      options: [{ option: '' }, {option: ''}],
    };
  }

  ngOnInit(): void {
    this.topicId = parseInt(this.route.snapshot.paramMap.get('id') ?? '1');
    this.mode = this.route.snapshot.paramMap.get('mode') ?? '';
    if (this.mode == 'edit') {
      this.topicService
        .getPollData(this.topicId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (r) => {
            this.title = r.title;
            this.poll = r.poll;
            this.poll.options = r.poll.options;
          },
          error: (e) => console.log(e),
        });
    }

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t: string) => {
        this.theme = t;
      });
  }

  onAddOption(): void {
    this.poll.options.push({ option: '' });
  }

  onDeleteOption(index: number): void {
    this.poll.options.splice(index, 1);
  }

  onSubmit(): void {
    if (this.poll.finish_date && this.poll.finish_date >= new Date().toJSON().slice(0, 10)) {
      this.topicService
        .poll(this.topicId, this.poll)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (r) => {
            this._toastService.show(this._translateService.instant(r.message));
            this.router.navigate([`/topic/${r.id}`]);
          },
          error: (e) => console.log(e),
        });
    }
    else {
      this.error = this._translateService.instant("VALIDATION.POLL.PAST")
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
