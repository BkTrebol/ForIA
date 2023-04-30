import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AdminComponent } from './admin.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
  declarations: [AdminComponent, SidenavComponent],
  imports: [BrowserModule, CommonModule, AdminRoutingModule],
  bootstrap: [AdminComponent],
})
export class AdminModule {}
