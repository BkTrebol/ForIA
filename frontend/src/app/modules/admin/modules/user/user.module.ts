import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ListComponent } from './components/list/list.component';
import { SharedModule } from '../shared.module';
import { EditComponent } from './components/edit/edit.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { RolesComponent } from './components/roles/roles.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [ListComponent, EditComponent, RolesComponent],
  imports: [
    SharedModule,
    CommonModule,
    UserRoutingModule,
    NgxDatatableModule,
    NgbDatepickerModule,
    DragDropModule,
  ],
})
export class UserModule {}
