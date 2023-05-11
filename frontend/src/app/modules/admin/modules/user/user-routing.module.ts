import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { RolesComponent } from './components/roles/roles.component';

const routes: Routes = [
  { path: '', component: ListComponent, pathMatch:'full'},
  { path: 'roles', component: RolesComponent},
  { path: ':id', component: EditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
