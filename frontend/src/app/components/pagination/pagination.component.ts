import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input('current_page') current_page: number;
  @Input('last_page') last_page: number;

  @Output('changePage') changePage= new EventEmitter<number>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.current_page = 1;
    this.last_page = 1;
  }

  onChangePage(value: number){
    this.changePage.emit(value);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: value },
      queryParamsHandling: 'merge',
    });
  }
}
