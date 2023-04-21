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
  public receivedMessages?: ListPm;
  public sentMessages?: ListPm;
  public loading: boolean;
  public theme:string;
  public showReceived:boolean;
  public receivedPage:number;
  public sentPage:number;

  constructor(
    private themeService: ThemeService,
    private privateMessageService: PrivateMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
    ) {
    this.receivedPage = this.route.snapshot.queryParams['page'] ?? 1;
    this.sentPage = this.route.snapshot.queryParams['spage'] ?? 1;
    this.showReceived = true;
    this.unsubscribe$ = new Subject();
    this.loading = true;
    this.theme = themeService.getTheme();
  }

  ngOnInit() {
    this.getReceivedMessages();
    this.getSentMessages();
      this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t) => {
        this.theme = t;
      });
  }

  deletePm(id: number) {

  }
  getReceivedMessages(){
    this.privateMessageService
    .getReceived(this.receivedPage)
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
  }

  getSentMessages(){
    this.privateMessageService
    .getSent(this.sentPage)
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
  }
  changeReceivedPage(page:number){
    this.receivedPage = page;
    this.getReceivedMessages();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge',
    });

  }
  changeSentPage(page:number){
    this.sentPage = page;
    this.getSentMessages();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { spage: page },
      queryParamsHandling: 'merge',
    });

  }

  onShowReceived(){
    this.showReceived = true;
  }
  onShowSent(){
    this.showReceived = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
