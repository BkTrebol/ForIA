import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../share.module';

import { TopicRoutingModule } from './topic-routing.module';
import { CreateComponent } from './components/create/create.component';
import { ViewComponent } from './components/view/view.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PollComponent } from './components/poll/poll.component';

@NgModule({
  declarations: [CreateComponent, ViewComponent, PollComponent],
  imports: [
    CommonModule,
    TopicRoutingModule,
    SharedModule,
    AngularEditorModule,
  ],
})
export class TopicModule {}
