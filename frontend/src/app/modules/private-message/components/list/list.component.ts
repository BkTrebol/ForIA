import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrivateMessageService } from '../../service/private-message.service';
import { ListPm } from 'src/app/models/receive/list-pm';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../../../styles/card.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public privateMessageList?: ListPm;
  public loading: boolean;

  constructor(private privateMessageService: PrivateMessageService) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
  }

  ngOnInit() {
    this.privateMessageService
      .getList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          console.log(r);
          this.privateMessageList = r;
          this.loading = false;
        },
        error: (e) => {
          console.log(e);
          this.loading = false;
        },
      });
  }

  deletePm(id: number) {

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
