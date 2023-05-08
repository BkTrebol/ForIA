import {  NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from './modules/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeadersInterceptor } from 'src/app/helpers/interceptors/headers.interceptor';

import { NgbCollapse, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [ 
    CommonModule, 
    AdminRoutingModule,
    SharedModule,
    HttpClientModule,
    NgbCollapse,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
  ],
  bootstrap: [],
})
export class AdminModule {}
