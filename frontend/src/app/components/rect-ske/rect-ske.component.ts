import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-rect-ske',
  host: {
    class: 'pulse',
  },
  template: ``,
  styleUrls: ['./rect-ske.component.scss']
})
export class RectSkeComponent {
  width: string;
  height: string;
  className: string;

  constructor(private host: ElementRef<HTMLElement>) {
    this.width = '100';
    this.height = '100';
    this.className = '';
  }

  ngOnInit() {
    const host = this.host.nativeElement;

    if (this.className) {
      host.classList.add(this.className);
    }

    host.style.setProperty('--skeleton-rect-width', this.width ?? '100%');
    host.style.setProperty('--skeleton-rect-height', this.height ?? '20px');
  }
}
