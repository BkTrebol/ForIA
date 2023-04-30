import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../share.module';

import { CategoryRoutingModule } from './category-routing.module';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ListComponent, ViewComponent],
  imports: [CommonModule, CategoryRoutingModule, SharedModule,NgbCollapseModule],
})
export class CategoryModule {}
