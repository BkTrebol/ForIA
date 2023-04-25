import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrivateMessageService } from '../../service/private-message.service';
import { ListPm } from 'src/app/models/receive/list-pm';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/helpers/services/toast.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../../../../styles/card.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public messages: { received: ListPm; sent: ListPm };
  public loading: boolean;
  public theme: string;
  public showReceived: boolean;
  // public receivedPage:number;
  // public sentPage:number;

  constructor(
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.messages = {
      received: {
        messages: [],
        page: {
          last: 1,
          current: this.route.snapshot.queryParams['rpage'] ?? 1,
          total: 1,
        },
      },
      sent: {
        messages: [],
        page: {
          last: 1,
          current: this.route.snapshot.queryParams['spage'] ?? 1,
          total: 1,
        },
      },
    };
    this.showReceived = true;
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.theme = themeService.getTheme();
  }

  ngOnInit() {
    // this.getReceivedMessages();
    // this.getSentMessages();
    this.getMessages();
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  deletePm(id: number) {}

  getMessages() {
    this.privateMessageService
      .getMessages(
        this.messages.received.page.current,
        this.messages.sent.page.current
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          console.log(r);
          this.messages = r;
          this.loading = false;
          if (
            parseInt(this.route.snapshot.queryParams['rpage'] ?? '1') !=
            r.received.page.current
          ) {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { rpage: r.received.page.current },
              queryParamsHandling: 'merge',
            });
          }
          if (
            parseInt(this.route.snapshot.queryParams['spage'] ?? '1') !=
            r.sent.page.current
          ) {
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: { rpage: r.sent.page.current },
              queryParamsHandling: 'merge',
            });
          }
        },
        error: (e) => console.log(e),
      });
  }
  // getReceivedMessages(){
  //   this.privateMessageService
  //   .getReceived(this.receivedPage)
  //   .pipe(takeUntil(this.unsubscribe$))
  //   .subscribe({
  //     next: (r) => {
  //       console.log(r);
  //       this.receivedMessages = r;
  //       this.loading = false;
  //     },
  //     error: (e) => {
  //       console.log(e);
  //       this.loading = false;
  //     },
  //   });
  // }

  // getSentMessages(){
  //   this.privateMessageService
  //   .getSent(this.messages.sent.page.current)
  //   .pipe(takeUntil(this.unsubscribe$))
  //   .subscribe({
  //     next: (r) => {
  //       console.log(r);
  //       this.messages.sent = r;
  //       this.loading = false;
  //     },
  //     error: (e) => {
  //       console.log(e);
  //       this.loading = false;
  //     },
  //   });
  // }

  changeReceivedPage(page: number) {
    this.messages.received.page.current = page;
    this.getMessages();
    // this.getReceivedMessages();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { rpage: page },
      queryParamsHandling: 'merge',
    });
  }
  
  changeSentPage(page: number) {
    this.messages.sent.page.current = page;
    this.getMessages();
    // this.getSentMessages();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { spage: page },
      queryParamsHandling: 'merge',
    });
  }

  onShowReceived() {
    this.showReceived = true;
  }
  onShowSent() {
    this.showReceived = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
