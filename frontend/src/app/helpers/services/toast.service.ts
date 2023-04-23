import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];
  dangerToasts: any[] = [];
  allToasts: any = {
    toasts: this.toasts,
    dangerToasts: this.dangerToasts,
  };

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showDanger(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.dangerToasts.push({ textOrTpl, ...options });
  }

  remove(toast: any, toastGroup: string = 'toasts') {
    if (toastGroup === 'dangerToasts') {
      this.dangerToasts = this.dangerToasts.filter((t) => t !== toast);
    } else {
      this.toasts = this.toasts.filter((t) => t !== toast);
    }
  }

  clear(toastGroup: string = 'toasts') {
    this.toasts.splice(0, this.toasts.length);
  }
}
