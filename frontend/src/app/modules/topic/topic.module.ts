import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../share.module';

import { TopicRoutingModule } from './topic-routing.module';
import { CreateComponent } from './components/create/create.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [CreateComponent, ViewComponent],
  imports: [CommonModule, TopicRoutingModule, SharedModule],
})
export class TopicModule {}
