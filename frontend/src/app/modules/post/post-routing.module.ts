import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { EditComponent } from './components/edit/edit.component';

const routes: Routes = [
  {
    path: 'create/:id',
    component: CreateComponent,
    title: 'ForIA',
  },
  {
    path: 'create',
    component: CreateComponent,
    title: 'ForIA',
  },
  {
    path: 'edit/:id',
    component: EditComponent,
    title: 'ForIA',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule { }
