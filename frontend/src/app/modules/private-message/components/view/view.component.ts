import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrivateMessage } from 'src/app/models/receive/list-pm';
import { PrivateMessageService } from '../../service/private-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss', '../../../../styles/card.scss'],
})
export class ViewComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public privateMessage?: PrivateMessage;
  public loading: boolean;
  public topicId: string;
  private page: number;

  constructor(
    private privateMessageService: PrivateMessageService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.topicId = '';
    this.page = 1;
  }

  ngOnInit() {
    this.topicId = this.route.snapshot.paramMap.get('id') ?? '';
    this.page = this.route.snapshot.queryParams['page'] ?? 1;
    this.getData();
  }

  getData() {
    this.loading = true;
    this.privateMessageService
      .getMessage(this.topicId, this.page)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          console.log(r);
          this.privateMessage = r;
          this.loading = false;
        },
        error: (e) => {
          console.log(e);
          this.loading = false;
        },
      });
  }

  changePage(page: number) {
    if (this.page == page) return;
    this.page = page;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
    });

    this.getData();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
