import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  NgbDatepickerModule,
  NgbModalModule,
  NgbTooltip
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModalModule,
    NgSelectModule,
    NgbDatepickerModule,
    NgbTooltip,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModalModule,
    NgSelectModule,
    NgbDatepickerModule,
    NgbTooltip,
  ],
})
export class SharedModule {}
