import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { ViewComponent } from './components/view/view.component';
import { PollComponent } from './components/poll/poll.component';
import { EditComponent } from './components/edit/edit.component';

const routes: Routes = [
  {
    path: 'create/:id',
    component: CreateComponent,
    title: 'ForIA',
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    title: 'ForIA',
  },
  {
    path: ':id/poll/:mode',
    component: PollComponent,
    title: 'Poll',
  },
  {
    path: ':id',
    component: ViewComponent,
    title: 'ForIA',
  },
  {
    path: '',
    redirectTo: '/error',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicRoutingModule {}
