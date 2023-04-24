import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { TopicService } from '../../service/topic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Poll } from 'src/app/models/send/create-topic';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss'],
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

  // public pollOptions: Array<{opt:string}>;
  constructor(
    private themeService: ThemeService,
    private topicService: TopicService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this.pollOptions = [];
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.error = '';
    this.theme = this.themeService.getTheme();
    this.mode = 'create';
    this.topicId = 0;
    this.title = '';
    this.poll = {
      finish_date: undefined,
      name: '',
      options: [{ option: '' }],
    };
  }

  ngOnInit(): void {
    this.topicId = parseInt(this.route.snapshot.paramMap.get('topic') ?? '1');
    this.mode = this.route.snapshot.paramMap.get('mode') ?? '';

    if (this.mode == 'edit') {
      this.topicService
        .getPollData(this.topicId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (r) => {
            console.log(r);
            this.title = r.title;
            this.poll = r.poll;
            this.poll.options = r.poll.options;
          },
          error: (e) => console.log(e),
        });
    }

    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  onAddOption() {
    this.poll.options.push({ option: '' });
    console.log(this.poll.options);
  }

  onDeleteOption(index: number) {
    this.poll.options.splice(index, 1);
  }

  onSubmit() {
    console.log(this.poll);
    this.topicService
      .poll(this.topicId, this.poll)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          console.log(r);
          this.router.navigate([`/topic/${r.id}`]);
        },
        error: (e) => console.log(e),
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
