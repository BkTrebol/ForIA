import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { NgbToast, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/helpers/services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService } from 'src/app/helpers/services/theme.service';
import { AuthService } from 'src/app/modules/auth/service/auth.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [NgbToastModule, NgIf, NgTemplateOutlet, NgFor],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  host: {
    class:
      'toast-container position-fixed bottom-0 w-100 mx-auto d-flex justify-content-center flex-column align-items-center p-3',
    style: 'z-index: 99;',
  },
})
export class ToastsContainer implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void>;
  public theme: string;

  constructor(
    public toastService: ToastService,
    private themeService: ThemeService,
    private authService: AuthService,
  ) {
    this.unsubscribe$ = new Subject();
    this.theme = themeService.getTheme();
  }

  ngOnInit(): void {
    this.themeService.theme
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((t: string) => {
        this.theme = t;
      });
  }

  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef;
  }

  closeToast(toast: NgbToast, group = '') {
    toast.hide;
    this.toastService.remove(toast, group);
  }

  hide(toast: any) {
    toast.hide();
  }

  sendVerification(){
    this.authService.sendVerification()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(()=> {
      this.toastService.show("Email Sent")
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}