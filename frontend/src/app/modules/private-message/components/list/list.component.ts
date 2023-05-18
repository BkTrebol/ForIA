import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrivateMessageService } from '../../service/private-message.service';
import { ListPm } from 'src/app/models/receive/list-pm';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/helpers/services/toast.service';
import {  TranslateService } from '@ngx-translate/core';
import { MessageRes } from 'src/app/models/common/message-res';

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
  public deleteSent: number[];
  public deleteReceived: number[];
  public sending: boolean;
  constructor(
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private _translateService: TranslateService
  ) {
    this.sending = false;
    this.deleteReceived = [];
    this.deleteSent = [];
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
    this.getMessages();
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  deletePm(id: number, type: string) {
    if (type === 'sent') {
      if (this.deleteSent.includes(id)) {
        this.deleteSent.splice(this.deleteSent.indexOf(id), 1);
      } else {
        this.deleteSent.push(id);
      }
    } else if (type === 'received') {
      if (this.deleteReceived.includes(id)) {
        this.deleteReceived.splice(this.deleteReceived.indexOf(id), 1);
      } else {
        this.deleteReceived.push(id);
      }
    }
  }

  onDeletePms() {
    this.sending = true;
    this.privateMessageService
      .delete(this.deleteSent, this.deleteReceived)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r: MessageRes) => {
          this.sending = false;
          this.getMessages();
          this.toastService.show(this._translateService.instant("MESSAGES_DELETED"));
        },
        error: () => {this.sending = false;}
      });
  }

  getMessages() {
    this.sending = false;
    this.loading = true;
    this.privateMessageService
      .getMessages(
        this.messages.received.page.current,
        this.messages.sent.page.current
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (r) => {
          this.messages = r;
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
        complete: () => {
          this.loading = false;
        },
      });
  }

  changeReceivedPage(page: number) {
    this.messages.received.page.current = page;
    this.getMessages();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { rpage: page },
      queryParamsHandling: 'merge',
    });
  }

  changeSentPage(page: number) {
    this.messages.sent.page.current = page;
    this.getMessages();
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
