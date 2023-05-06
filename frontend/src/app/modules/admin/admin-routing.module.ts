import {  NgModule } from '@angular/core';
import {  RouterModule, Routes } from '@angular/router';
import { canActivateAdmin } from 'src/app/helpers/guards/canActivateChild/admin.guard';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login', loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    children: [
      
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'categories',
        canActivate: [canActivateAdmin],
        loadChildren: () =>
          import('./modules/category/category.module').then(
            (m) => m.CategoryModule
          ),
        // canLoad: [CheckGuard],
      },
      {
        path: 'dashboard',
        canActivate: [canActivateAdmin],
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        // canLoad: [CheckGuard],
      },
      {
        path: 'users',
        canActivate: [canActivateAdmin],
        loadChildren: () =>
          import('./modules/user/user.module').then(
            (m) => m.UserModule
          ),
        // canLoad: [CheckGuard],
      },]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
