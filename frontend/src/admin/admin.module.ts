import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AdminComponent } from './admin.component';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from './modules/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeadersInterceptor } from 'src/app/helpers/interceptors/headers.interceptor';

@NgModule({
  declarations: [AdminComponent, SidenavComponent],
  imports: [BrowserModule,BrowserAnimationsModule, CommonModule, AdminRoutingModule,SharedModule,HttpClientModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },],
  bootstrap: [AdminComponent],
})
export class AdminModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
    // require('style-loader!./styles/style.scss');
  }
}
