import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { ViewComponent } from './components/view/view.component';

// Guards
import { AuthGuard } from '../../helpers/guards/canActivate/auth.guard';
import { RoleGuard } from '../../helpers/guards/canActivate/role.guard';

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
  providers: [AuthGuard, RoleGuard],
})
export class TopicRoutingModule {}
