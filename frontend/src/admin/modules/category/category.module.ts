import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './components/category/category.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    DragDropModule,
    NgbModule,
    CommonModule,
    CategoryRoutingModule
  ]
})
export class CategoryModule { }
