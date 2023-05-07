import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../shared.module';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    UserRoutingModule,
    NgxDatatableModule
  ]
})
export class UserModule { }
