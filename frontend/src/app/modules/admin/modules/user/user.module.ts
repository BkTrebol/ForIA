import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { SharedModule } from '../shared.module';
import { UserRoutingModule } from './user-routing.module';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { RolesComponent } from './components/roles/roles.component';
import { SharedModule as S2 } from 'src/app/modules/share.module';

@NgModule({
  declarations: [ListComponent, EditComponent, RolesComponent],
  imports: [
    SharedModule,
    CommonModule,
    UserRoutingModule,
    NgxDatatableModule,
    NgbDatepickerModule,
    DragDropModule,
    S2,
  ],
})
export class UserModule {}
