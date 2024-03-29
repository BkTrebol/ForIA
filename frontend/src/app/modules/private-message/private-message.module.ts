import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateMessageRoutingModule } from './private-message-routing.module';
import { CreateComponent } from './components/create/create.component';
import { ListComponent } from './components/list/list.component';
import { ReplyComponent } from './components/reply/reply.component';
import { ViewComponent } from './components/view/view.component';
import { SharedModule } from '../share.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [CreateComponent, ListComponent, ReplyComponent, ViewComponent],
  imports: [
    CommonModule,
    PrivateMessageRoutingModule,
    SharedModule,
    AngularEditorModule,
  ],
})
export class PrivateMessageModule {}
