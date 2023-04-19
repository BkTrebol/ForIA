import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input('current_page') current_page: number;
  @Input('last_page') last_page: number;

  @Output('changePage') changePage;
  @ViewChild('pagination3') pagination:any;
  // @ViewChild('paginationLink') pagLink:ElementRef;
  constructor(private router: Router, public route: ActivatedRoute) {
    this.current_page = 1;
    this.last_page = 1;
    this.changePage = new EventEmitter<number>();
  }

  onChangePage(newPage: number) {
    this.changePage.emit(newPage);
    this.pagination.innerHTML = '...'
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge',
    });
  }

  onKeyDown(event: KeyboardEvent) {
    let target = event.target as HTMLLinkElement;
  
    const keyCode = event.code;
    if (
      +event.key > this.last_page ||
      +`${target.textContent}${event.key}` > this.last_page
    ) {
      event.preventDefault();
    }


    if (
      (keyCode < 'Digit1' || keyCode > 'Digit9') &&
      keyCode !== 'Enter' &&
      keyCode !== 'Backspace' &&
      keyCode !== 'Delete'
    ) {
      event.preventDefault();
    }
  }

  onFocus(event: FocusEvent) {
    let target = event.target as HTMLLinkElement;
    target.textContent = '';
  }

  onBlur(event: FocusEvent) {
    let target = event.target as HTMLLinkElement;
    target.textContent = '...';
  }
}
