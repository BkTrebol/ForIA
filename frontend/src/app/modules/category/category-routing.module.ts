import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';

import { AuthGuard } from 'src/app/helpers/guards/canActivate/auth.guard';

const routes: Routes = [
  { path: '', component: ListComponent, title: 'ForIA' },
  { path: 'category/:id', component: ViewComponent, title: 'ForIA' },
  // { path: 'create/', component: CreateComponent, title: 'ForIA', canActivate: [AuthGuard], },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class CategoryRoutingModule {}
