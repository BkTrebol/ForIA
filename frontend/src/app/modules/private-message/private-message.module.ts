import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateMessageRoutingModule } from './private-message-routing.module';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';
import { ReplyComponent } from './components/reply/reply.component';


@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    ReplyComponent
  ],
  imports: [
    CommonModule,
    PrivateMessageRoutingModule
  ]
})
export class PrivateMessageModule { }
