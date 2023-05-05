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

@NgModule({
  declarations: [AdminComponent, SidenavComponent],
  imports: [BrowserModule, CommonModule, AdminRoutingModule,SharedModule],
  bootstrap: [AdminComponent],
})
export class AdminModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
