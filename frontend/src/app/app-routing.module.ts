import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Guard
import { AuthGuard } from './helpers/guards/auth.guard';
import { RoleGuard } from './helpers/guards/role.guard';
import { AuthRoutingModule } from './modules/auth/auth-routing.module';
import { UserRoutingModule } from './modules/user/user-routing.module';
import { CategoryRoutingModule } from './modules/category/category-routing.module';

const routes: Routes = [
  {path: 'auth', loadChildren: () => AuthRoutingModule},
  {path: 'user', loadChildren: () => UserRoutingModule,canActivate:[AuthGuard]},
  {path: '', loadChildren: () => CategoryRoutingModule},
  {path: '**',redirectTo: '/', pathMatch: 'full'} // TODO: Error Page.
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard],
})
export class AppRoutingModule {}
