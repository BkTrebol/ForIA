import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';

import { CategoryResolver } from '../../helpers/resolvers/category.resolver';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    title: 'ForIA',
    resolve: {
      response: CategoryResolver,
    },
  },
  {
    path: 'category/:id',
    component: ViewComponent,
    title: 'ForIA',
  },
  {
    path: '',
    redirectTo: '/error',
    pathMatch: 'full',
  },
  // { path: 'create/', component: CreateComponent, title: 'ForIA' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CategoryResolver],
})
export class CategoryRoutingModule {}
