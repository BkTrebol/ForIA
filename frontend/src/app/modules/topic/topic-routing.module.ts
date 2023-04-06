import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { ViewComponent } from './components/view/view.component';

import { TopicResolver } from 'src/app/helpers/resolvers/topic.resolver';

const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent,
    title: 'ForIA',
  },
  {
    path: ':id',
    component: ViewComponent,
    title: 'ForIA',
    resolve: {
      response: TopicResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [TopicResolver],
})
export class TopicRoutingModule {}
