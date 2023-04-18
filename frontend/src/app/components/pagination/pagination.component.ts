import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input('current_page') current_page: number;
  @Input('last_page') last_page: number;
  @Output('changePage') changePage: Function;

  constructor() {
    this.current_page = 1;
    this.last_page = 1;
    this.changePage = () => {
      console.log("hola")
    };
  }
}
