import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { ViewComponent } from './components/view/view.component';

import { AuthGuard } from '../../helpers/guards/canActivate/auth.guard';

const routes: Routes = [
  {
    path: 'create',
    component: CreateComponent,
    title: 'ForIA',
    canActivate: [AuthGuard],
  },
  { path: ':id', component: ViewComponent, title: 'ForIA' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class TopicRoutingModule {}
