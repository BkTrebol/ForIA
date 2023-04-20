import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrivateMessageService } from '../../service/private-message.service';
import { ListPm } from 'src/app/models/receive/list-pm';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../../../styles/card.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public receivedMessages?: ListPm;
  public sentMessages?: ListPm;
  public loading: boolean;
  public theme:string;
  constructor(
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService
    ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.theme = themeService.getTheme();
  }

  ngOnInit() {
    this.privateMessageService
      .getReceived()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          console.log(r);
          this.receivedMessages = r;
          this.loading = false;
        },
        error: (e) => {
          console.log(e);
          this.loading = false;
        },
      });
      this.privateMessageService
      .getSent()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          console.log(r);
          this.sentMessages = r;
          this.loading = false;
        },
        error: (e) => {
          console.log(e);
          this.loading = false;
        },
      });

      this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  deletePm(id: number) {

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
